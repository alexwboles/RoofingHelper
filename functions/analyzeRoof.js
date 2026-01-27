export default {
  async fetch(request) {
    return new Response(JSON.stringify({
      ok: true,
      message: "Function is working"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
