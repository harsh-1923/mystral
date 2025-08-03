-- Create the likes table for craft interactions
CREATE TABLE IF NOT EXISTS craft_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  craft_id TEXT NOT NULL UNIQUE,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on craft_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_craft_likes_craft_id ON craft_likes(craft_id);

-- Enable Row Level Security
ALTER TABLE craft_likes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to read and update likes
CREATE POLICY "Allow all users to read likes" ON craft_likes
  FOR SELECT USING (true);

CREATE POLICY "Allow all users to update likes" ON craft_likes
  FOR UPDATE USING (true);

CREATE POLICY "Allow all users to insert likes" ON craft_likes
  FOR INSERT WITH CHECK (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE TRIGGER update_craft_likes_updated_at
    BEFORE UPDATE ON craft_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for existing crafts
INSERT INTO craft_likes (craft_id, like_count) VALUES 
  ('glyph-inspector', 0),
  ('focus-accordion', 0)
ON CONFLICT (craft_id) DO NOTHING;