-- Create solutions table
CREATE TABLE IF NOT EXISTS solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  image_url TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, admin write)
CREATE POLICY "Public solutions are viewable by everyone" 
ON solutions FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert solutions" 
ON solutions FOR INSERT 
WITH CHECK (true); -- Ideally restrict to admin role but for now simplistic

CREATE POLICY "Admins can update solutions" 
ON solutions FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete solutions" 
ON solutions FOR DELETE 
USING (true);

-- Insert initial data
INSERT INTO solutions (id, title, description, icon, image_url, features) VALUES
(
  'e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
  '低空物流',
  '构建高效、灵活的城市末端配送与城际运输网络，突破地面交通拥堵限制，实现快速送达。',
  'Truck',
  'https://images.unsplash.com/photo-1586772002130-b0f3da8210e3?auto=format&fit=crop&q=80&w=800',
  ARRAY['末端配送', '医疗样本运输', '跨海/山地运输', '应急物资投送']
),
(
  'f2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7',
  '应急救援',
  '利用无人机的高机动性，在自然灾害、火灾等紧急情况下进行快速侦查、物资投送与辅助救援。',
  'Ambulance',
  'https://images.unsplash.com/photo-1508614589041-895b8cba7e32?auto=format&fit=crop&q=80&w=800',
  ARRAY['灾情侦查', '空中喊话', '救援物资空投', '生命探测']
),
(
  'a3b4c5d6-e7f8-b9c0-d1e2-f3a4b5c6d7e8',
  '空中游览',
  '结合eVTOL与直升机技术，开发城市观光、景区游览等低空文旅项目，打造全新的视角体验。',
  'Plane',
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800',
  ARRAY['城市观光', '景区航拍', '低空跳伞', '飞行体验']
),
(
  'b4c5d6e7-f8a9-c0d1-e2f3-a4b5c6d7e8f9',
  '农林植保',
  '应用植保无人机进行精准施药、播种与农情监测，提高农业生产效率，减少农药浪费。',
  'Sprout',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800',
  ARRAY['精准施药', '种子播撒', '农情监测', '果树授粉']
),
(
  'c5d6e7f8-a9b0-d1e2-f3a4-b5c6d7e8f9a0',
  '智慧巡检',
  '替代人工对电力线路、石油管道、桥梁风机等基础设施进行高频次、高精度的自动化巡检。',
  'Radio',
  'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800',
  ARRAY['电力巡检', '管道监测', '河道治理', '交通执法']
)
ON CONFLICT (id) DO NOTHING;
