/* ============================================================
   foodapi.js — Open Food Facts search (v2 endpoint).
   Free, public, CORS-friendly. Returns simplified results.
   Throws a descriptive error on failure so the UI can show it.
   ============================================================ */
const ENDPOINT = "https://world.openfoodfacts.org/api/v2/search";

/**
 * Search OFF for `query`. Returns up to `limit` simplified results.
 * Each result: { name, brand, kcalPer100g, proteinPer100g }
 * @throws Error with a human-readable message on network/HTTP/parse failure.
 */
export async function searchFood(query, limit = 6) {
  if (!query || !query.trim()) return [];
  const url = `${ENDPOINT}?search_terms=${encodeURIComponent(query.trim())}` +
    `&fields=product_name,brands,nutriments&page_size=${limit}`;

  let res;
  try {
    res = await fetch(url, { method: "GET", credentials: "omit" });
  } catch (e) {
    throw new Error("Network error — check your connection. (" + (e.message || e) + ")");
  }
  if (!res.ok) throw new Error("Food API HTTP " + res.status);

  let json;
  try { json = await res.json(); }
  catch { throw new Error("Food API returned a non-JSON response."); }

  const out = [];
  for (const p of (json.products || [])) {
    const name = (p.product_name || "").trim();
    const n = p.nutriments || {};
    let kcal = +n["energy-kcal_100g"];
    if (!kcal && +n["energy_100g"]) kcal = +n["energy_100g"] / 4.184; // kJ -> kcal
    const protein = +n["proteins_100g"];
    if (!name || !kcal || isNaN(protein)) continue;
    out.push({
      name, brand: (p.brands || "").split(",")[0].trim(),
      kcalPer100g: Math.round(kcal),
      proteinPer100g: Math.round(protein * 10) / 10,
    });
    if (out.length >= limit) break;
  }
  return out;
}
