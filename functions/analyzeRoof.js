// functions/analyzeRoof.js
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const address = url.searchParams.get("address");

      if (!address) {
        return new Response(JSON.stringify({ error: "Missing address" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // 1. Geocode address → lat/lng
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const geo = await geoRes.json();
      if (!geo.length) throw new Error("Address not found");

      const lat = geo[0].lat;
      const lon = geo[0].lon;

      // 2. Fetch satellite image (static map tile)
      const satUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=20&size=600x600&maptype=satellite&key=${env.GOOGLE_MAPS_KEY}`;
      const satImg = await fetch(satUrl);
      const satBlob = await satImg.arrayBuffer();

      // 3. Send to AI vision model
      const aiRes = await fetch(env.AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.AI_KEY}` },
        body: JSON.stringify({
          image: [...new Uint8Array(satBlob)],
          prompt: "Analyze this roof. Return JSON with: squareFootage, roofSections, materialType."
        })
      });

      const aiData = await aiRes.json();

      // 4. Return structured result
      return new Response(JSON.stringify(aiData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
