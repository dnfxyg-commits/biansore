import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("partnership_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      res
        .status(500)
        .json({ error: "Failed to load partnership applications" });
      return;
    }

    const mapped = (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      company: row.company,
      phone: row.phone,
      city: row.city,
      email: row.email,
      message: row.message,
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
      .from("partnership_applications")
      .delete()
      .eq("id", id);

    if (error) {
      res
        .status(500)
        .json({ error: "Failed to delete partnership application" });
      return;
    }

    res.status(204).end();
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
