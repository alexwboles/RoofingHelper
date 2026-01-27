document.getElementById("analyze").onclick = async () => {
  const address = document.getElementById("address").value.trim();
  const results = document.getElementById("results");

  if (!address) {
    results.textContent = "Please enter an address.";
    return;
  }

  results.textContent = "Analyzing roof from satellite imagery...";

  try {
    const res = await fetch(`/api/analyzeRoof?address=${encodeURIComponent(address)}`);
    const data = await res.json();

    if (data.error) {
      results.textContent = "Error: " + data.error;
      return;
    }

    results.innerHTML = `
      <h3>Roof Analysis</h3>
      <p><strong>Square Footage:</strong> ${data.squareFootage}</p>
      <p><strong>Roof Sections:</strong> ${data.roofSections}</p>
      <p><strong>Material Type:</strong> ${data.materialType}</p>
    `;
  } catch (err) {
    results.textContent = "Unable to analyze roof.";
  }
};
