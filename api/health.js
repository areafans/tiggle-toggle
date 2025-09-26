const { init } = require('@launchdarkly/node-server-sdk');

let ldClient;

function initializeLaunchDarkly() {
  if (!ldClient) {
    const LAUNCHDARKLY_SDK_KEY = process.env.LAUNCHDARKLY_SDK_KEY;

    if (!LAUNCHDARKLY_SDK_KEY) {
      console.warn('LAUNCHDARKLY_SDK_KEY not found, LaunchDarkly will be disabled');
      return null;
    }

    ldClient = init(LAUNCHDARKLY_SDK_KEY, {
      timeout: 5,
      offline: false
    });

    // Don't block on initialization - let it initialize in background
    ldClient.waitForInitialization().catch(error => {
      console.warn('LaunchDarkly initialization failed:', error.message);
    });
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
    const client = initializeLaunchDarkly();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        launchdarkly: client ? client.initialized() : false,
        openai: !!process.env.OPENAI_API_KEY
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(200).json({
      status: 'degraded',
      error: error.message,
      timestamp: new Date().toISOString(),
      services: {
        launchdarkly: false,
        openai: !!process.env.OPENAI_API_KEY
      }
    });
  }
}