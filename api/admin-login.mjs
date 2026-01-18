import { supabase } from "../server/supabaseClient.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const adminJwtSecret =
  process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (!adminJwtSecret) {
    res.status(500).json({ error: "Missing admin JWT secret" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error || !data) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const match = await bcrypt.compare(password, data.password_hash);

  if (!match) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    {
      sub: data.id,
      username: data.username,
      role: data.role
    },
    adminJwtSecret,
    { expiresIn: "7d" }
  );

  res.setHeader(
    "Set-Cookie",
    `admin_token=${token}; HttpOnly; Path=/; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );

  res.status(200).json({
    id: data.id,
    username: data.username,
    role: data.role
  });
}

