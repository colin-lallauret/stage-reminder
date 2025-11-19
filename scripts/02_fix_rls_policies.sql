-- Drop existing problematic policies
DROP POLICY IF EXISTS "Only admins can insert entreprises" ON entreprises;
DROP POLICY IF EXISTS "Only admins can update entreprises" ON entreprises;
DROP POLICY IF EXISTS "Only admins can delete entreprises" ON entreprises;

-- New RLS Policy: Authenticated users can insert
CREATE POLICY "Authenticated users can insert entreprises"
  ON entreprises
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- New RLS Policy: Authenticated users can update their own entries
-- (For now, anyone authenticated can update - enhance this later if needed)
CREATE POLICY "Authenticated users can update entreprises"
  ON entreprises
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- New RLS Policy: Authenticated users can delete
CREATE POLICY "Authenticated users can delete entreprises"
  ON entreprises
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
