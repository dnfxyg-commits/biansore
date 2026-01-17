import express from "express";
import cors from "cors";
import { supabase } from "./supabaseClient.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*"
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
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
  const { exhibitionId, ticketType, name, email } = req.body || {};

  if (!exhibitionId || !ticketType || !name || !email) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const { error } = await supabase.from("ticket_bookings").insert({
    exhibition_id: exhibitionId,
    ticket_type: ticketType,
    name,
    email
  });

  if (error) {
    res.status(500).json({ error: "Failed to save ticket booking" });
    return;
  }

  res.status(201).json({ success: true });
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

app.get("/api/exhibition-centers", async (req, res) => {
  const { data, error } = await supabase.from("exhibition_centers").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to load exhibition centers" });
    return;
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    nameEn: row.name_en,
    location: row.location,
    address: row.address,
    area: row.area,
    description: row.description,
    imageUrl: row.image_url,
    facilities: row.facilities || [],
    region: row.region,
    country: row.country,
    city: row.city
  }));

  res.json(mapped);
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
    date: row.date,
    source: row.source,
    author: row.author,
    tags: row.tags || [],
    imageUrl: row.image_url
  }));

  res.json(mapped);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
