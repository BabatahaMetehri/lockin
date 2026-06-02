/* ============================================================
   foodapi.js — Open Food Facts search. Free, public, CORS-friendly.
   ============================================================ */
const ENDPOINT = "https://world.openfoodfacts.org/cgi/search.pl";

/**
 * Search OFF for `query`. Returns up to `limit` simplified results.
 * Each result: { name, brand, kcalPer100g, proteinPer100g }
 */
export async function searchFood(query, limit = 6) {
  if (!query || !query.trim()) return [];
  const url = `${ENDPOINT}?search_terms=${encodeURIComponent(query.trim())}` +
    `&search_simple=1&action=process&json=1&page_size=${limit}` +
    `&fields=product_name,brands,nutriments`;
  const res = await fetch(url, { method: "GET", credentials: "omit", referrerPolicy: "no-referrer" });
  if (!res.ok) throw new Error("Search failed");
  const json = await res.json();
  const out = [];
  for (const p of (json.products || [])) {
    const name = (p.product_name || "").trim();
    const n = p.nutriments || {};
    // OFF stores per-100g energy in either kcal or kJ; prefer kcal
    let kcal = +n["energy-kcal_100g"];
    if (!kcal && +n["energy_100g"]) kcal = +n["energy_100g"] / 4.184;
    const protein = +n["proteins_100g"];
    if (!name || !kcal || isNaN(protein)) continue;
    out.push({
      name, brand: (p.brands || "").split(",")[0].trim(),
      kcalPer100g: Math.round(kcal), proteinPer100g: Math.round(protein * 10) / 10,
    });
    if (out.length >= limit) break;
  }
  return out;
}
