import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { exhibitionId, name, phone } = req.body || {};

  if (!exhibitionId || !name || !phone) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const { error } = await supabase.from("ticket_bookings").insert({
    exhibition_id: exhibitionId,
    ticket_type: "Standard",
    name,
    phone
  });

  if (error) {
    res.status(500).json({ error: "Failed to save ticket booking" });
    return;
  }

  res.status(201).json({ success: true });
}
