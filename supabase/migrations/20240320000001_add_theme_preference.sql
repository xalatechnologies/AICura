-- Add theme column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS theme text DEFAULT 'light'
CHECK (theme IN ('light', 'dark'));

-- Add index for theme column
CREATE INDEX IF NOT EXISTS idx_profiles_theme ON profiles(theme); 