import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabase } from "./supabaseClient.mjs";
import crypto from "crypto";

const app = express();
const port = process.env.PORT || 4000;

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

if (!adminJwtSecret) {
  throw new Error("Missing ADMIN_JWT_SECRET or SUPABASE_SERVICE_ROLE_KEY");
}

const corsOrigin = process.env.CORS_ORIGIN || true;

app.use(
  cors({
    origin: corsOrigin,
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());

app.get(["/health", "/api/health"], (req, res) => {
  res.json({ status: "ok" });
});

const signAdminToken = (payload) =>
  jwt.sign(payload, adminJwtSecret, { expiresIn: "7d" });

const requireAdmin = (req, res, next) => {
  const token =
    req.cookies?.admin_token ||
    req.headers["x-admin-token"] ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, adminJwtSecret);
    req.adminUser = {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role
    };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/api/admin/login", async (req, res) => {
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

  const token = signAdminToken({
    sub: data.id,
    username: data.username,
    role: data.role
  });

  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    id: data.id,
    username: data.username,
    role: data.role
  });
});

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  res.status(204).end();
});

app.get("/api/admin/me", requireAdmin, (req, res) => {
  res.status(200).json({
    id: req.adminUser.id,
    username: req.adminUser.username,
    role: req.adminUser.role,
    isSuperAdmin: isSuperAdminUser(req.adminUser)
  });
});

app.get("/api/admin/users", requireAdmin, async (req, res) => {
  if (req.adminUser.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

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
});

app.post("/api/admin/users", requireAdmin, async (req, res) => {
  if (req.adminUser.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

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
    !isSuperAdminUser(req.adminUser)
  ) {
    res
      .status(403)
      .json({ error: "Only super admin can create admin user" });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

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
    isActive: data.is_active !== false,
    createdAt: data.created_at
  });
});

const updateAdminUserHandler = async (req, res, id) => {
  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const { role, isActive } = req.body || {};

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

  if (role && id === req.adminUser.id) {
    res.status(400).json({ error: "Cannot change own role" });
    return;
  }

  const currentRole = existing.role;
  const currentIsActive = existing.is_active !== false;
  const nextRole = role || currentRole;
  const nextIsActive =
    typeof isActive === "boolean" ? isActive : currentIsActive;

  if (superAdminUsernames.length && !isSuperAdminUser(req.adminUser)) {
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
};

app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
  if (req.adminUser.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  await updateAdminUserHandler(req, res, req.params.id);
});

app.patch("/api/admin/users", requireAdmin, async (req, res) => {
  if (req.adminUser.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  await updateAdminUserHandler(req, res, (req.body || {}).id);
});

app.post("/api/admin/change-password", requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Missing password" });
    return;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", req.adminUser.id)
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
    .eq("id", req.adminUser.id);

  if (updateError) {
    res.status(500).json({ error: "Failed to update password" });
    return;
  }

  res.status(200).json({ success: true });
});

app.post("/api/booth-applications", async (req, res) => {
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
});

app.use("/api/admin", requireAdmin);

app.post("/api/partnership-applications", async (req, res) => {
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
});

app.post("/api/ticket-bookings", async (req, res) => {
  console.log("ticket booking request body", req.body);
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
    console.error("Failed to save ticket booking", error);
    res.status(500).json({ error: "Failed to save ticket booking" });
    return;
  }

  res.status(201).json({ success: true });
});

app.get("/api/admin/booth-applications", async (req, res) => {
  const { data, error } = await supabase
    .from("booth_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: "Failed to load booth applications" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    exhibitionId: row.exhibition_id,
    companyName: row.company_name,
    contactName: row.contact_name,
    workEmail: row.work_email,
    boothArea: row.booth_area,
    purpose: row.purpose,
    createdAt: row.created_at
  }));

  res.json(mapped);
});

app.get("/api/admin/partnership-applications", async (req, res) => {
  const { data, error } = await supabase
    .from("partnership_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: "Failed to load partnership applications" });
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

  res.json(mapped);
});

app.get("/api/admin/ticket-bookings", async (req, res) => {
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

  res.json(mapped);
});

app.delete("/api/admin/booth-applications", async (req, res) => {
  const { id } = req.body || {};

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const { error } = await supabase
    .from("booth_applications")
    .delete()
    .eq("id", id);

  if (error) {
    res.status(500).json({ error: "Failed to delete booth application" });
    return;
  }

  res.status(204).end();
});

app.delete("/api/admin/partnership-applications", async (req, res) => {
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
    res.status(500).json({ error: "Failed to delete partnership application" });
    return;
  }

  res.status(204).end();
});

app.delete("/api/admin/ticket-bookings", async (req, res) => {
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
});

app.get("/api/exhibitions", async (req, res) => {
  const { data, error } = await supabase.from("exhibitions").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load exhibitions" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    location: row.location,
    date: row.date,
    description: row.description,
    imageUrl: row.image_url,
    category: row.category,
    featured: row.featured,
    coordinates: { lat: row.lat, lng: row.lng },
    region: row.region,
    websiteUrl: row.website_url
  }));

  res.json(mapped);
});

app.get("/api/solutions", async (req, res) => {
  const { data, error } = await supabase
    .from("solutions")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    res.status(500).json({ error: "Failed to load solutions" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    imageUrl: row.image_url,
    features: row.features || []
  }));

  res.json(mapped);
});

app.get("/api/admin/solutions", async (req, res) => {
  const { data, error } = await supabase
    .from("solutions")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching admin solutions:", error);
    res.status(500).json({ error: "Failed to load solutions" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    imageUrl: row.image_url,
    features: row.features || []
  }));

  res.json(mapped);
});

app.post("/api/admin/solutions", async (req, res) => {
  const { title, description, icon, imageUrl, features } = req.body || {};

  if (!title || !description || !icon) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const featuresArray = Array.isArray(features)
    ? features.filter((f) => typeof f === "string" && f.trim() !== "")
    : [];

  const { data, error } = await supabase
    .from("solutions")
    .insert({
      title,
      description,
      icon,
      image_url: imageUrl || null,
      features: featuresArray
    })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    res.status(500).json({ error: "Failed to create solution" });
    return;
  }

  res.status(201).json({
    id: data.id,
    title: data.title,
    description: data.description,
    icon: data.icon,
    imageUrl: data.image_url,
    features: data.features || []
  });
});

app.put("/api/admin/solutions", async (req, res) => {
  const { id, title, description, icon, imageUrl, features } = req.body || {};

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const featuresArray = Array.isArray(features)
    ? features.filter((f) => typeof f === "string" && f.trim() !== "")
    : [];

  const update = {
    title,
    description,
    icon,
    image_url: imageUrl || null,
    features: featuresArray,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("solutions")
    .update(update)
    .eq("id", id);

  if (error) {
    res.status(500).json({ error: "Failed to update solution" });
    return;
  }

  res.status(200).json({ success: true });
});

app.delete("/api/admin/solutions", async (req, res) => {
  const { id } = req.body || {};

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const { error } = await supabase.from("solutions").delete().eq("id", id);

  if (error) {
    res.status(500).json({ error: "Failed to delete solution" });
    return;
  }

  res.status(204).end();
});

app.get("/api/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load products" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    imageUrl: row.image_url,
    description: row.description,
    status: row.status,
    specs: row.specs || []
  }));

  res.json(mapped);
});

app.get("/api/blog-posts", async (req, res) => {
  const { data, error } = await supabase.from("blog_posts").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load blog posts" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    date: row.date,
    source: row.source,
    author: row.author,
    tags: row.tags || [],
    imageUrl: row.image_url
  }));

  res.json(mapped);
});

app.get("/api/admin/blog-posts", async (req, res) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching admin blog posts:", error);
    res.status(500).json({ error: "Failed to load blog posts" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    date: row.date,
    source: row.source,
    author: row.author,
    tags: row.tags || [],
    imageUrl: row.image_url
  }));

  console.log(`[Admin] Fetched ${mapped.length} blog posts. First post tags:`, mapped[0]?.tags);

  res.json(mapped);
});

app.post("/api/admin/blog-posts", async (req, res) => {
  const { title, summary, date, source, author, tags, imageUrl, content } =
    req.body || {};

  if (!title || !summary || !date || !source) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const tagsArray = Array.isArray(tags)
    ? tags.filter((tag) => typeof tag === "string" && tag.trim() !== "")
    : [];

  const id = crypto.randomUUID();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      id,
      title,
      summary,
      content: content || null,
      date,
      source,
      author: author || null,
      tags: tagsArray,
      image_url: imageUrl || null
    })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    res.status(500).json({ error: "Failed to create blog post" });
    return;
  }

  res.status(201).json({
    id: data.id,
    title: data.title,
    summary: data.summary,
    content: data.content,
    date: data.date,
    source: data.source,
    author: data.author,
    tags: data.tags || [],
    imageUrl: data.image_url
  });
});

app.put("/api/admin/blog-posts", async (req, res) => {
  const { id, title, summary, date, source, author, tags, imageUrl, content } =
    req.body || {};

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const tagsArray = Array.isArray(tags)
    ? tags.filter((tag) => typeof tag === "string" && tag.trim() !== "")
    : [];

  const update = {
    title,
    summary,
    content: content || null,
    date,
    source,
    author: author || null,
    tags: tagsArray,
    image_url: imageUrl || null
  };

  const { error } = await supabase
    .from("blog_posts")
    .update(update)
    .eq("id", id);

  if (error) {
    res.status(500).json({ error: "Failed to update blog post" });
    return;
  }

  res.status(200).json({ success: true });
});

app.delete("/api/admin/blog-posts", async (req, res) => {
  const { id } = req.body || {};

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    res.status(500).json({ error: "Failed to delete blog post" });
    return;
  }

  res.status(204).end();
});

app.post("/api/admin/exhibitions", async (req, res) => {
  const {
    title,
    location,
    date,
    description,
    imageUrl,
    category,
    featured,
    region,
    websiteUrl,
    lat,
    lng
  } = req.body || {};

  if (!title || !location || !date) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const id = crypto.randomUUID();

  const { error } = await supabase.from("exhibitions").insert({
    id,
    title,
    location,
    date,
    description: description || null,
    image_url: imageUrl || null,
    category: category || null,
    featured: !!featured,
    region: region || null,
    website_url: websiteUrl || null,
    lat: lat ?? null,
    lng: lng ?? null
  });

  if (error) {
    res.status(500).json({ error: "Failed to create exhibition" });
    return;
  }

  res.status(201).json({ id });
});

app.put("/api/admin/exhibitions", async (req, res) => {
  const {
    id,
    title,
    location,
    date,
    description,
    imageUrl,
    category,
    featured,
    region,
    websiteUrl,
    lat,
    lng
  } = req.body || {};

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const update = {
    title,
    location,
    date,
    description: description || null,
    image_url: imageUrl || null,
    category: category || null,
    featured: !!featured,
    region: region || null,
    website_url: websiteUrl || null,
    lat: lat ?? null,
    lng: lng ?? null
  };

  const { error } = await supabase
    .from("exhibitions")
    .update(update)
    .eq("id", id);

  if (error) {
    res.status(500).json({ error: "Failed to update exhibition" });
    return;
  }

  res.status(200).json({ success: true });
});

// Solutions Endpoints
app.get("/api/solutions", async (req, res) => {
  const { data, error } = await supabase.from("solutions").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load solutions" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    imageUrl: row.image_url,
    features: row.features || []
  }));

  res.json(mapped);
});

app.get("/api/admin/solutions", async (req, res) => {
  const { data, error } = await supabase.from("solutions").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load solutions" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    imageUrl: row.image_url,
    features: row.features || []
  }));

  res.json(mapped);
});

app.post("/api/admin/solutions", async (req, res) => {
  const { title, description, icon, imageUrl, features } = req.body || {};

  if (!title || !description) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const id = crypto.randomUUID();

  const { error } = await supabase.from("solutions").insert({
    id,
    title,
    description,
    icon: icon || null,
    image_url: imageUrl || null,
    features: features || []
  });

  if (error) {
    res.status(500).json({ error: "Failed to create solution" });
    return;
  }

  res.status(201).json({
    id,
    title,
    description,
    icon: icon || null,
    imageUrl: imageUrl || null,
    features: features || []
  });
});

app.put("/api/admin/solutions", async (req, res) => {
  const { id, title, description, icon, imageUrl, features } = req.body || {};

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const update = {
    title,
    description,
    icon: icon || null,
    image_url: imageUrl || null,
    features: features || []
  };

  const { error } = await supabase.from("solutions").update(update).eq("id", id);

  if (error) {
    res.status(500).json({ error: "Failed to update solution" });
    return;
  }

  res.status(200).json({ success: true });
});

app.delete("/api/admin/solutions", async (req, res) => {
  const { id } = req.body || {};

  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }

  const { error } = await supabase.from("solutions").delete().eq("id", id);

  if (error) {
    res.status(500).json({ error: "Failed to delete solution" });
    return;
  }

  res.status(204).end();
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, "../dist");
  
  app.use(express.static(distPath));
  
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not Found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
