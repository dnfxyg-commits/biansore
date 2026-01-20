
-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  specs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies
-- Public read access
CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT USING (true);

-- Admin write access (assuming authentication via service role or admin token logic in server)
-- Note: The server uses service role key for operations, which bypasses RLS. 
-- However, if we were using client-side Supabase auth with roles, we'd need these.
-- Since we are using a node server with service role key, these policies are mainly for
-- if we ever access from client directly or for consistency.
-- For now, the Node.js server bypasses RLS so we are good, but let's add them for completeness if using authenticated client.
-- But wait, the server uses `supabaseClient.mjs` which likely uses the service role key if configured that way.
-- Let's check `supabaseClient.mjs`.
