import { init } from '@launchdarkly/node-server-sdk';

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

export async function GET(request) {
  try {
    const client = await initializeLaunchDarkly();

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        launchdarkly: client.initialized(),
        openai: !!process.env.OPENAI_API_KEY
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return Response.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}