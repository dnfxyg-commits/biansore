import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { data, error } = await supabase.from("exhibitions").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load exhibitions" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    location: row.location,
    date: row.date,
    description: row.description,
    imageUrl: row.image_url,
    category: row.category,
    featured: row.featured,
    coordinates: { lat: row.lat, lng: row.lng },
    region: row.region,
    websiteUrl: row.website_url
  }));

  res.status(200).json(mapped);
}

