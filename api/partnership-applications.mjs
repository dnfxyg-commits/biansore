import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, company, phone, city, email, message } = req.body || {};

  if (!name || !company || !phone || !city || !email || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const { error } = await supabase.from("partnership_applications").insert({
    name,
    company,
    phone,
    city,
    email,
    message
  });

  if (error) {
    res.status(500).json({ error: "Failed to save partnership application" });
    return;
  }

  res.status(201).json({ success: true });
}

