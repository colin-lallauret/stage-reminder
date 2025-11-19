-- Create enterprises table with obligatory schema
CREATE TABLE IF NOT EXISTS entreprises (
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
CREATE INDEX IF NOT EXISTS idx_entreprises_ville ON entreprises(ville_entrep);
CREATE INDEX IF NOT EXISTS idx_entreprises_domaine ON entreprises(domaine_entrep);
CREATE INDEX IF NOT EXISTS idx_entreprises_nom ON entreprises(nom_entrep);

-- Enable RLS (Row Level Security)
ALTER TABLE entreprises ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read
CREATE POLICY "Entreprises are viewable by everyone" 
  ON entreprises 
  FOR SELECT 
  USING (true);

-- RLS Policy: Only admins can insert (identified by being in auth.users with admin claim)
CREATE POLICY "Only admins can insert entreprises"
  ON entreprises
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'admin' = 'true');

-- RLS Policy: Only admins can update
CREATE POLICY "Only admins can update entreprises"
  ON entreprises
  FOR UPDATE
  USING (auth.jwt() ->> 'admin' = 'true');

-- RLS Policy: Only admins can delete
CREATE POLICY "Only admins can delete entreprises"
  ON entreprises
  FOR DELETE
  USING (auth.jwt() ->> 'admin' = 'true');
