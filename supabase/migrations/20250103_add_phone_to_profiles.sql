-- Add phone column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create an index on the phone column for faster lookups
CREATE INDEX IF NOT EXISTS profiles_phone_idx ON profiles(phone);

-- Add a unique constraint to prevent duplicate phone numbers
ALTER TABLE profiles ADD CONSTRAINT profiles_phone_key UNIQUE (phone);

-- Update the RLS policies to include phone number
ALTER POLICY "Public profiles are viewable by everyone." ON profiles
    USING (true);

ALTER POLICY "Users can insert their own profile." ON profiles
    WITH CHECK (auth.uid() = id);

ALTER POLICY "Users can update own profile." ON profiles
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
