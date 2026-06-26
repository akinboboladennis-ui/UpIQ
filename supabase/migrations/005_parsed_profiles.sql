-- Migration: 005_parsed_profiles
-- Creates the parsed_profiles table for storing structured profile parse results

CREATE TABLE IF NOT EXISTS parsed_profiles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text      text NOT NULL,
  parsed_data   jsonb NOT NULL,
  parser_version text NOT NULL DEFAULT '1.0.0',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS parsed_profiles_user_id_idx ON parsed_profiles (user_id);

-- Index for version-based queries (useful for re-parsing outdated records)
CREATE INDEX IF NOT EXISTS parsed_profiles_version_idx ON parsed_profiles (parser_version);

-- Enable RLS
ALTER TABLE parsed_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own parsed profiles
CREATE POLICY "parsed_profiles_select_own"
  ON parsed_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own parsed profiles
CREATE POLICY "parsed_profiles_insert_own"
  ON parsed_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own parsed profiles
CREATE POLICY "parsed_profiles_update_own"
  ON parsed_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own parsed profiles
CREATE POLICY "parsed_profiles_delete_own"
  ON parsed_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_parsed_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER parsed_profiles_updated_at
  BEFORE UPDATE ON parsed_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_parsed_profiles_updated_at();
