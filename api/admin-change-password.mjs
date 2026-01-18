import { supabase } from "../server/supabaseClient.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const adminJwtSecret =
  process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

const getAdminFromRequest = (req) => {
  if (!adminJwtSecret) {
    return null;
  }

  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const [k, ...rest] = c.split("=");
        return [k, rest.join("=")];
      })
  );

  const token =
    cookies.admin_token ||
    req.headers["x-admin-token"] ||
    (req.headers.authorization || "").replace("Bearer ", "");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, adminJwtSecret);
    return {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role
    };
  } catch {
    return null;
  }
};

export default async function handler(req, res) {
  if (!adminJwtSecret) {
    res.status(500).json({ error: "Missing admin JWT secret" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const adminUser = getAdminFromRequest(req);

  if (!adminUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Missing password" });
    return;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", adminUser.id)
    .maybeSingle();

  if (error || !data) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  const match = await bcrypt.compare(currentPassword, data.password_hash);

  if (!match) {
    res.status(401).json({ error: "Invalid current password" });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: "Password too short" });
    return;
  }

  const hash = await bcrypt.hash(newPassword, 10);

  const { error: updateError } = await supabase
    .from("admin_users")
    .update({ password_hash: hash })
    .eq("id", adminUser.id);

  if (updateError) {
    res.status(500).json({ error: "Failed to update password" });
    return;
  }

  res.status(200).json({ success: true });
}

