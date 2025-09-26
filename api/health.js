const { init } = require('@launchdarkly/node-server-sdk');

let ldClient;

async function initializeLaunchDarkly() {
  if (!ldClient) {
    const LAUNCHDARKLY_SDK_KEY = process.env.LAUNCHDARKLY_SDK_KEY;

    if (!LAUNCHDARKLY_SDK_KEY) {
      throw new Error('LAUNCHDARKLY_SDK_KEY environment variable is required');
    }

    ldClient = init(LAUNCHDARKLY_SDK_KEY);
    await ldClient.waitForInitialization();
  }
  return ldClient;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const client = await initializeLaunchDarkly();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        launchdarkly: client.initialized(),
        openai: !!process.env.OPENAI_API_KEY
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}