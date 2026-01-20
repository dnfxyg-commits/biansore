import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { error } = await supabase.from("exhibitions").select("id").limit(1);

  if (error) {
    res.status(500).json({ status: "error" });
    return;
  }

  res.status(200).json({ status: "ok" });
}

