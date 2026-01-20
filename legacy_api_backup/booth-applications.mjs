import { supabase } from "../server/supabaseClient.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { exhibitionId, companyName, contactName, workEmail, boothArea, purpose } = req.body || {};

  if (!exhibitionId || !companyName || !contactName || !workEmail || !purpose) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const { error } = await supabase.from("booth_applications").insert({
    exhibition_id: exhibitionId,
    company_name: companyName,
    contact_name: contactName,
    work_email: workEmail,
    booth_area: boothArea || null,
    purpose
  });

  if (error) {
    res.status(500).json({ error: "Failed to save booth application" });
    return;
  }

  res.status(201).json({ success: true });
}

