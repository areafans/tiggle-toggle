export async function GET(request) {
  return Response.json({
    message: 'API test endpoint working!',
    timestamp: new Date().toISOString(),
    method: 'GET'
  });
}

export async function POST(request) {
  return Response.json({
    message: 'API test endpoint working!',
    timestamp: new Date().toISOString(),
    method: 'POST'
  });
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