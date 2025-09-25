require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { init } = require('@launchdarkly/node-server-sdk');
const { initAi } = require('@launchdarkly/server-sdk-ai');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables
const LAUNCHDARKLY_SDK_KEY = process.env.LAUNCHDARKLY_SDK_KEY || 'sdk-key-123abc';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Initialize LaunchDarkly
let ldClient;
let aiClient;

async function initializeLaunchDarkly() {
  try {
    // Initialize LaunchDarkly server SDK
    ldClient = init(LAUNCHDARKLY_SDK_KEY);
    await ldClient.waitForInitialization();
    console.log('✅ LaunchDarkly initialized successfully');

    // Initialize AI client
    aiClient = initAi(ldClient);
    console.log('✅ LaunchDarkly AI client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize LaunchDarkly:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app origin
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      launchdarkly: ldClient?.initialized() || false,
      openai: !!OPENAI_API_KEY
    }
  });
});

// AI Chat endpoint using LaunchDarkly AI Config
app.post('/api/ai-chat', async (req, res) => {
  try {
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

    // Get AI Config from LaunchDarkly
    const aiConfigKey = 'chatbot-config'; // This will be created in LaunchDarkly dashboard
    const aiConfig = await aiClient.config(aiConfigKey, context, {
      // Default configuration if AI Config not found - using low-cost models
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
    });

    console.log('🤖 Using AI Config:', {
      model: aiConfig.model?.name,
      temperature: aiConfig.model?.parameters?.temperature,
      systemPrompt: aiConfig.messages?.[0]?.content?.substring(0, 100) + '...'
    });

    // Prepare messages for OpenAI
    const messages = [
      ...(aiConfig.messages || []),
      {
        role: 'user',
        content: message
      }
    ];

    // Track request start time for metrics
    const requestStart = Date.now();

    // Call OpenAI with LaunchDarkly-configured settings
    const completion = await openai.chat.completions.create({
      model: aiConfig.model?.name || 'gpt-3.5-turbo',
      messages: messages,
      temperature: aiConfig.model?.parameters?.temperature || 0.7,
      max_tokens: aiConfig.model?.parameters?.max_tokens || 300,
      stream: false // For now, we'll implement streaming later
    });

    const responseTime = Date.now() - requestStart;
    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Track metrics back to LaunchDarkly
    if (aiClient.trackMetrics) {
      await aiClient.trackMetrics(aiConfigKey, context, {
        'response_time_ms': responseTime,
        'tokens_used': completion.usage?.total_tokens || 0,
        'model_used': aiConfig.model?.name || 'gpt-4',
        'success': true
      });
    }

    console.log('✅ AI response generated:', {
      responseTime: `${responseTime}ms`,
      tokensUsed: completion.usage?.total_tokens,
      model: aiConfig.model?.name
    });

    res.json({
      response,
      metadata: {
        model: aiConfig.model?.name || 'gpt-4',
        responseTime,
        tokensUsed: completion.usage?.total_tokens,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ AI Chat error:', error);

    // Track error metrics
    if (aiClient.trackMetrics) {
      try {
        await aiClient.trackMetrics('chatbot-config', req.body.userContext || {}, {
          'error': true,
          'error_type': error.name || 'unknown',
          'response_time_ms': Date.now() - requestStart
        });
      } catch (metricError) {
        console.error('❌ Error tracking metrics:', metricError);
      }
    }

    res.status(500).json({
      error: 'Failed to generate AI response',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// AI Config status endpoint for debugging
app.get('/api/ai-config-status', async (req, res) => {
  try {
    const context = {
      kind: 'user',
      key: 'debug-user',
      name: 'Debug User'
    };

    const aiConfig = await aiClient.config('chatbot-config', context, {
      model: { name: 'gpt-4' },
      messages: [{ role: 'system', content: 'Default system prompt' }]
    });

    res.json({
      status: 'ok',
      config: {
        model: aiConfig.model,
        messageCount: aiConfig.messages?.length || 0,
        firstMessage: aiConfig.messages?.[0]?.content?.substring(0, 100) + '...'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Start server
async function startServer() {
  await initializeLaunchDarkly();

  app.listen(PORT, () => {
    console.log(`🚀 AI Config server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 AI Chat endpoint: http://localhost:${PORT}/api/ai-chat`);
    console.log(`🔧 AI Config status: http://localhost:${PORT}/api/ai-config-status`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...');
  if (ldClient) {
    await ldClient.close();
  }
  process.exit(0);
});

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});