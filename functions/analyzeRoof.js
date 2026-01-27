// functions/analyzeRoof.js
export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const address = url.searchParams.get("address");

      if (!address) {
        return json({ error: "Missing address" }, 400);
      }

      // Mock AI output for now
      const mock = {
        address,
        squareFootage: 2450,
        roofSections: 6,
        materialType: "Architectural Shingle"
      };

      return json(mock, 200);

    } catch (err) {
      return json({ error: err.message }, 500);
    }
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
