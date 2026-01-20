import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("ticket_bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: "Failed to load ticket bookings" });
      return;
    }

    const mapped = (data || []).map((row) => ({
      id: row.id,
      exhibitionId: row.exhibition_id,
      ticketType: row.ticket_type,
      name: row.name,
      phone: row.phone,
      createdAt: row.created_at
    }));

    res.status(200).json(mapped);
    return;
  }

  if (req.method === "DELETE") {
    const { id } = req.body || {};

    if (!id) {
      res.status(400).json({ error: "Missing id" });
      return;
    }

    const { error } = await supabase
      .from("ticket_bookings")
      .delete()
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: "Failed to delete ticket booking" });
      return;
    }

    res.status(204).end();
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
