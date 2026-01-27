export default {
  async fetch(request) {
    const url = new URL(request.url);
    const address = url.searchParams.get("address");

    if (!address) {
      return new Response(JSON.stringify({ error: "Missing address" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Mock response for now
    return new Response(JSON.stringify({
      address,
      squareFootage: 2400,
      roofSections: 5,
      materialType: "Architectural Shingle"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
