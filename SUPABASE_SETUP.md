# Supabase Real-time Likes Setup

This guide will help you set up Supabase for real-time likes functionality in your craft portfolio.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm/pnpm installed

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a name and password for your database
3. Wait for the project to be fully provisioned

### 2. Configure Environment Variables

Create a `.env.local` file in your project root with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard:

- Go to Settings → API
- Copy the Project URL and anon/public key

### 3. Create the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase_schema.sql`:

```sql
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

-- Create policies for public access
CREATE POLICY "Allow all users to read likes" ON craft_likes
  FOR SELECT USING (true);

CREATE POLICY "Allow all users to update likes" ON craft_likes
  FOR UPDATE USING (true);

CREATE POLICY "Allow all users to insert likes" ON craft_likes
  FOR INSERT WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_craft_likes_updated_at
    BEFORE UPDATE ON craft_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for existing crafts
INSERT INTO craft_likes (craft_id, like_count) VALUES
  ('glyph-inspector', 0),
  ('focus-accordion', 0)
ON CONFLICT (craft_id) DO NOTHING;
```

### 4. Enable Real-time

1. In your Supabase dashboard, go to Database → Replication
2. Enable replication for the `craft_likes` table
3. This allows real-time subscriptions to work

## How It Works

### Database Schema

- `craft_likes` table stores like counts for each craft
- Each craft has a unique `craft_id` that matches the ID in your `CRAFTS` array
- Real-time subscriptions automatically update the UI when likes change

### Real-time Features

- **Double Tap**: Users can double-tap the video to like (with heart animation)
- **Button Click**: Users can click the heart button to like
- **Live Updates**: Like counts update in real-time across all clients
- **Persistence**: Likes are stored in the database and persist across sessions

### Component Features

- Automatically fetches current like count on component mount
- Creates database records for new crafts if they don't exist
- Real-time subscription updates likes without refreshing
- Loading states during database operations
- Error handling for database operations

## Adding New Crafts

When you add new crafts to your `CRAFTS` array:

1. Make sure each craft has a unique `id` field
2. The component will automatically create a database record for new craft IDs
3. Or you can manually insert them using SQL:

```sql
INSERT INTO craft_likes (craft_id, like_count) VALUES
  ('your-new-craft-id', 0)
ON CONFLICT (craft_id) DO NOTHING;
```

## Testing

1. Open multiple browser windows/tabs to your craft page
2. Like a craft in one window
3. Watch the like count update in real-time in other windows
4. Double-tap or click the heart button to test both interaction methods

## Troubleshooting

### Common Issues:

1. **Environment variables not working**: Make sure `.env.local` is in your project root and restart your development server

2. **Database connection errors**: Verify your Supabase URL and API key are correct

3. **Real-time not working**: Ensure replication is enabled for the `craft_likes` table in your Supabase dashboard

4. **Likes not updating**: Check browser console for errors and verify your Row Level Security policies

### Debugging:

Check the browser console for error messages. The component logs errors from database operations.

## Next Steps

- Consider adding user authentication to track individual likes
- Add like animation improvements
- Implement rate limiting for likes
- Add analytics tracking for popular crafts
