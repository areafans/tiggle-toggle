const OpenAI = require('openai');

module.exports = async (req, res) => {
  console.log('🎯 AI Test request received:', req.method);

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
    console.log('🔑 Environment check:', {
      hasOpenAiKey: !!process.env.OPENAI_API_KEY
    });

    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY environment variable not found');
      return res.status(500).json({
        error: 'Missing API key',
        details: 'OPENAI_API_KEY environment variable not found'
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

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

    // Prepare simple messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant for ToggleLab. Keep responses brief and helpful.'
      },
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

    // Call OpenAI with simple settings
    console.log('🚀 Calling OpenAI API...');
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
        stream: false
      });
      console.log('✅ OpenAI API call successful');
    } catch (error) {
      console.error('❌ OpenAI API call failed:', error.message);
      throw error;
    }

    const responseTime = Date.now() - requestStart;
    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('✅ AI response generated:', {
      responseTime: `${responseTime}ms`,
      tokensUsed: completion.usage?.total_tokens
    });

    res.status(200).json({
      response,
      metadata: {
        model: 'gpt-3.5-turbo',
        responseTime,
        tokensUsed: completion.usage?.total_tokens,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ AI Test error occurred:');
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
      details: errorDetails
    });
  }
}