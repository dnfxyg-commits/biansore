import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { data, error } = await supabase.from("exhibition_centers").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load exhibition centers" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    nameEn: row.name_en,
    location: row.location,
    address: row.address,
    area: row.area,
    description: row.description,
    imageUrl: row.image_url,
    facilities: row.facilities || [],
    region: row.region,
    country: row.country,
    city: row.city
  }));

  res.status(200).json(mapped);
}

