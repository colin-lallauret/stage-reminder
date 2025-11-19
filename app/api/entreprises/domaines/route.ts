import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Récupérer tous les domaines uniques (non-null)
    const { data, error } = await supabase
      .from('entreprises')
      .select('domaine_entrep')
      .not('domaine_entrep', 'is', null)
      .order('domaine_entrep');

    if (error) {
      console.error('Error fetching domains:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extraire les domaines uniques
    const uniqueDomains = [...new Set(
      data
        .map(item => item.domaine_entrep)
        .filter(domain => domain && domain.trim() !== '')
    )].sort();

    return NextResponse.json(uniqueDomains);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}
