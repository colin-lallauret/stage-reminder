-- Complete reset of RLS policies - delete old ones and create permissive ones
-- Drop the table completely to reset everything
DROP TABLE IF EXISTS entreprises CASCADE;

-- Recreate the table
CREATE TABLE entreprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  nom_entrep TEXT NOT NULL,
  ville_entrep TEXT NOT NULL,
  nom_respon TEXT,
  mail_respon TEXT,
  domaine_entrep TEXT,
  latitude FLOAT,
  longitude FLOAT
);

-- Create indexes for faster queries
CREATE INDEX idx_entreprises_ville ON entreprises(ville_entrep);
CREATE INDEX idx_entreprises_domaine ON entreprises(domaine_entrep);
CREATE INDEX idx_entreprises_nom ON entreprises(nom_entrep);

-- Enable RLS
ALTER TABLE entreprises ENABLE ROW LEVEL SECURITY;

-- New simple RLS policies that work with authenticated users
-- RLS Policy: Everyone can read
CREATE POLICY "Everyone can read entreprises"
  ON entreprises
  FOR SELECT
  USING (true);

-- RLS Policy: Authenticated users can insert
CREATE POLICY "Authenticated users can insert"
  ON entreprises
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policy: Authenticated users can update
CREATE POLICY "Authenticated users can update"
  ON entreprises
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- RLS Policy: Authenticated users can delete
CREATE POLICY "Authenticated users can delete"
  ON entreprises
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
