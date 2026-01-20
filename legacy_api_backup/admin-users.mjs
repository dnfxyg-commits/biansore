import { supabase } from "../server/supabaseClient.mjs";
import jwt from "jsonwebtoken";

const adminJwtSecret =
  process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

const superAdminUsernames = (process.env.ADMIN_SUPER_ADMINS || "")
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

const isSuperAdminUser = (user) => {
  if (!user) {
    return false;
  }
  if (!superAdminUsernames.length) {
    return false;
  }
  return superAdminUsernames.includes(user.username);
};

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

  const adminUser = getAdminFromRequest(req);

  if (!adminUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (adminUser.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, role, created_at, is_active")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: "Failed to load admin users" });
      return;
    }

    const mapped = (data || []).map((row) => ({
      id: row.id,
      username: row.username,
      role: row.role,
      isSuperAdmin: isSuperAdminUser({ username: row.username }),
      isActive: row.is_active !== false,
      createdAt: row.created_at
    }));

    res.status(200).json(mapped);
    return;
  }

  if (req.method === "POST") {
    const { username, password, role } = req.body || {};

    if (!username || !password || !role) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password too short" });
      return;
    }

    if (
      role === "admin" &&
      superAdminUsernames.length &&
      !isSuperAdminUser(adminUser)
    ) {
      res
        .status(403)
        .json({ error: "Only super admin can create admin user" });
      return;
    }

    const hash = await import("bcryptjs").then((m) =>
      m.default.hash(password, 10)
    );

    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        username,
        password_hash: hash,
        role,
        is_active: true
      })
      .select("id, username, role, created_at, is_active")
      .maybeSingle();

    if (error || !data) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    res.status(201).json({
      id: data.id,
      username: data.username,
      role: data.role,
      isSuperAdmin: isSuperAdminUser({ username: data.username }),
      isActive: data.is_active !== false,
      createdAt: data.created_at
    });
    return;
  }

  if (req.method === "PATCH") {
    const { id, role, isActive } = req.body || {};

    if (!id) {
      res.status(400).json({ error: "Missing id" });
      return;
    }

    if (!role && typeof isActive !== "boolean") {
      res.status(400).json({ error: "Nothing to update" });
      return;
    }

    const { data: existing, error: existingError } = await supabase
      .from("admin_users")
      .select("id, role, is_active")
      .eq("id", id)
      .maybeSingle();

    if (existingError || !existing) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    if (role && id === adminUser.id) {
      res.status(400).json({ error: "Cannot change own role" });
      return;
    }

    const currentRole = existing.role;
    const currentIsActive = existing.is_active !== false;
    const nextRole = role || currentRole;
    const nextIsActive =
      typeof isActive === "boolean" ? isActive : currentIsActive;

    if (superAdminUsernames.length && !isSuperAdminUser(adminUser)) {
      const targetIsAdminNow = currentRole === "admin";
      const targetWillBeAdmin = nextRole === "admin";

      if (targetIsAdminNow || targetWillBeAdmin) {
        res
          .status(403)
          .json({ error: "Only super admin can manage admin users" });
        return;
      }
    }

    const currentlyActiveAdmin =
      currentRole === "admin" && currentIsActive;
    const willBeActiveAdmin =
      nextRole === "admin" && nextIsActive;

    if (currentlyActiveAdmin && !willBeActiveAdmin) {
      const { data: admins, error: adminsError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("role", "admin")
        .neq("is_active", false);

      if (adminsError) {
        res.status(500).json({ error: "Failed to check admin users" });
        return;
      }

      if (!admins || admins.length <= 1) {
        res.status(400).json({ error: "Cannot disable last admin user" });
        return;
      }
    }

    const update = {};

    if (role) {
      update.role = role;
    }

    if (typeof isActive === "boolean") {
      update.is_active = isActive;
    }

    const { error } = await supabase
      .from("admin_users")
      .update(update)
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: "Failed to update user" });
      return;
    }

    res.status(200).json({ success: true });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
