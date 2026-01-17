import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load products" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    imageUrl: row.image_url,
    description: row.description,
    status: row.status,
    specs: row.specs || []
  }));

  res.status(200).json(mapped);
}

