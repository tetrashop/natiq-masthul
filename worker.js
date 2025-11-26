export default {
  async fetch(request) {
    return new Response(JSON.stringify({
      status: "فعال",
      message: "سیستم نطق مصطلح در حال اجراست",
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
