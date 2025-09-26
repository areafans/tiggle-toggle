const { init } = require('@launchdarkly/node-server-sdk');
const { initAi } = require('@launchdarkly/server-sdk-ai');
const OpenAI = require('openai');

let ldClient;
let aiClient;

function initializeServices() {
  console.log('🔧 Initializing services...');

  if (!ldClient) {
    const LAUNCHDARKLY_SDK_KEY = process.env.LAUNCHDARKLY_SDK_KEY;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    console.log('🔑 Environment check:', {
      hasLdKey: !!LAUNCHDARKLY_SDK_KEY,
      hasOpenAiKey: !!OPENAI_API_KEY
    });

    if (!OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY environment variable not found');
      return { ldClient: null, aiClient: null };
    }

    if (!LAUNCHDARKLY_SDK_KEY) {
      console.warn('⚠️ LAUNCHDARKLY_SDK_KEY not found, using defaults');
      return { ldClient: null, aiClient: null };
    }

    try {
      // Initialize LaunchDarkly with timeout
      console.log('🚀 Initializing LaunchDarkly client...');
      ldClient = init(LAUNCHDARKLY_SDK_KEY, {
        timeout: 5,
        offline: false
      });
      console.log('✅ LaunchDarkly client created');

      // Initialize AI client
      try {
        console.log('🤖 Initializing AI client...');
        aiClient = initAi(ldClient);
        console.log('✅ AI client initialized successfully');
      } catch (error) {
        console.warn('⚠️ AI client initialization failed:', error.message);
        aiClient = null;
      }
    } catch (error) {
      console.error('❌ LaunchDarkly initialization failed:', error.message);
      return { ldClient: null, aiClient: null };
    }
  }

  console.log('🎯 Services ready:', { hasLdClient: !!ldClient, hasAiClient: !!aiClient });
  return { ldClient, aiClient };
}

module.exports = async (req, res) => {
  console.log('🎯 AI Chat request received:', req.method);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request handled');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.log('❌ Invalid method:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('🔧 Starting service initialization...');
    const { ldClient: client, aiClient: ai } = initializeServices();

    const { message, userContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create LaunchDarkly context from user info
    const context = {
      kind: 'user',
      key: userContext?.key || 'anonymous',
      name: userContext?.name || 'Anonymous User',
      email: userContext?.email || 'anonymous@togglelab.com',
      role: userContext?.role || 'standard-user',
      team: 'ToggleLab Engineering',
      // Add custom attributes for targeting
      isBetaUser: userContext?.role === 'beta-user',
      isLabOwner: userContext?.role === 'lab-owner',
      accessLevel: userContext?.role === 'lab-owner' ? 'admin' :
                   userContext?.role === 'beta-user' ? 'beta' : 'standard',
      department: userContext?.role === 'lab-owner' ? 'product' :
                  userContext?.role === 'beta-user' ? 'engineering' : 'marketing',
      experienceLevel: userContext?.role === 'lab-owner' ? 'expert' :
                       userContext?.role === 'beta-user' ? 'advanced' : 'beginner'
    };

    console.log('🎯 AI Chat request for context:', context);

    // Get AI Config from LaunchDarkly (if available)
    let aiConfig = {
      model: {
        name: 'gpt-3.5-turbo',
        parameters: {
          temperature: 0.7,
          max_tokens: 300
        }
      },
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for ToggleLab, a developer experience platform.
                   You help with experiment design, metrics analysis, and performance monitoring.
                   Keep responses helpful, concise, and focused on developer productivity.`
        }
      ]
    };

    if (ai) {
      try {
        const aiConfigKey = 'chatbot-config';
        aiConfig = await ai.config(aiConfigKey, context, aiConfig);
      } catch (error) {
        console.warn('Failed to get AI config from LaunchDarkly, using defaults:', error.message);
      }
    }

    console.log('🤖 Using AI Config:', {
      model: aiConfig.model?.name,
      temperature: aiConfig.model?.parameters?.temperature
    });

    // Initialize OpenAI
    console.log('🔧 Initializing OpenAI client...');
    let openai;
    try {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('✅ OpenAI client initialized');
    } catch (error) {
      console.error('❌ OpenAI client initialization failed:', error.message);
      throw error;
    }

    // Prepare messages for OpenAI
    const messages = [
      ...(aiConfig.messages || []),
      {
        role: 'user',
        content: message
      }
    ];

    console.log('📝 Prepared messages for OpenAI:', {
      messageCount: messages.length,
      userMessage: message.substring(0, 50) + '...'
    });

    // Track request start time for metrics
    const requestStart = Date.now();

    // Call OpenAI with LaunchDarkly-configured settings
    console.log('🚀 Calling OpenAI API...');
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: aiConfig.model?.name || 'gpt-3.5-turbo',
        messages: messages,
        temperature: aiConfig.model?.parameters?.temperature || 0.7,
        max_tokens: aiConfig.model?.parameters?.max_tokens || 300,
        stream: false
      });
      console.log('✅ OpenAI API call successful');
    } catch (error) {
      console.error('❌ OpenAI API call failed:', error.message);
      throw error;
    }

    const responseTime = Date.now() - requestStart;
    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Track metrics back to LaunchDarkly (if available)
    if (ai && ai.trackMetrics) {
      try {
        await ai.trackMetrics('chatbot-config', context, {
          'response_time_ms': responseTime,
          'tokens_used': completion.usage?.total_tokens || 0,
          'model_used': aiConfig.model?.name || 'gpt-3.5-turbo',
          'success': true
        });
      } catch (error) {
        console.warn('Failed to track metrics to LaunchDarkly:', error.message);
      }
    }

    console.log('✅ AI response generated:', {
      responseTime: `${responseTime}ms`,
      tokensUsed: completion.usage?.total_tokens,
      model: aiConfig.model?.name
    });

    res.status(200).json({
      response,
      metadata: {
        model: aiConfig.model?.name || 'gpt-3.5-turbo',
        responseTime,
        tokensUsed: completion.usage?.total_tokens,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ AI Chat error occurred:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // More specific error details for debugging
    const errorDetails = {
      name: error.name,
      message: error.message,
      code: error.code,
      type: error.type,
      status: error.status
    };

    console.error('Full error details:', errorDetails);

    res.status(500).json({
      error: 'Failed to generate AI response',
      details: process.env.NODE_ENV === 'development' ? errorDetails : 'Internal server error'
    });
  }
}