import { supabase } from "../server/supabaseClient.mjs";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      title,
      location,
      date,
      description,
      imageUrl,
      category,
      featured,
      region,
      websiteUrl,
      lat,
      lng
    } = req.body || {};

    if (!title || !location || !date) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const id = crypto.randomUUID();

    const { error } = await supabase.from("exhibitions").insert({
      id,
      title,
      location,
      date,
      description: description || null,
      image_url: imageUrl || null,
      category: category || null,
      featured: !!featured,
      region: region || null,
      website_url: websiteUrl || null,
      lat: lat ?? null,
      lng: lng ?? null
    });

    if (error) {
      res.status(500).json({ error: "Failed to create exhibition" });
      return;
    }

    res.status(201).json({ id });
    return;
  }

  if (req.method === "PUT") {
    const {
      id,
      title,
      location,
      date,
      description,
      imageUrl,
      category,
      featured,
      region,
      websiteUrl,
      lat,
      lng
    } = req.body || {};

    if (!id) {
      res.status(400).json({ error: "Missing id" });
      return;
    }

    const update = {
      title,
      location,
      date,
      description: description || null,
      image_url: imageUrl || null,
      category: category || null,
      featured: !!featured,
      region: region || null,
      website_url: websiteUrl || null,
      lat: lat ?? null,
      lng: lng ?? null
    };

    const { error } = await supabase
      .from("exhibitions")
      .update(update)
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: "Failed to update exhibition" });
      return;
    }

    res.status(200).json({ success: true });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}

