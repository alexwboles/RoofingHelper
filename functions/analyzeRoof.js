// functions/analyzeRoof.js
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const address = url.searchParams.get("address");

      if (!address) {
        return json({ error: "Missing address" }, 400);
      }

      // 1. Geocode address → lat/lng
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const geo = await geoRes.json();
      if (!geo.length) throw new Error("Address not found");

      const lat = geo[0].lat;
      const lon = geo[0].lon;

      // 2. Fetch satellite image (Google Static Maps)
      const satUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=20&size=600x600&maptype=satellite&key=${env.GOOGLE_MAPS_KEY}`;
      const satImg = await fetch(satUrl);
      const satBlob = await satImg.arrayBuffer();

      // 3. Send to AI vision model
      const aiRes = await fetch(env.AI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.AI_KEY}`
        },
        body: JSON.stringify({
          prompt: "Analyze this roof. Return JSON with: squareFootage, roofSections, materialType.",
          image: [...new Uint8Array(satBlob)]
        })
      });

      const aiData = await aiRes.json();

      return json(aiData, 200);

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
