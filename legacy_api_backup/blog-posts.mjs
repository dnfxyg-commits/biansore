import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { data, error } = await supabase.from("blog_posts").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load blog posts" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    date: row.date,
    source: row.source,
    author: row.author,
    tags: row.tags || [],
    imageUrl: row.image_url
  }));

  res.status(200).json(mapped);
}

