import jwt from "jsonwebtoken";

const adminJwtSecret =
  process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (!adminJwtSecret) {
    res.status(500).json({ error: "Missing admin JWT secret" });
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
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
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, adminJwtSecret);
    res.status(200).json({
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

