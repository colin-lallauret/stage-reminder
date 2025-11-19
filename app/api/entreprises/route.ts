import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  let query = supabase.from('entreprises').select('*');

  // Filter by city
  const city = searchParams.get('ville');
  if (city) {
    query = query.ilike('ville_entrep', `%${city}%`);
  }

  // Filter by domain
  const domain = searchParams.get('domaine');
  if (domain) {
    query = query.ilike('domaine_entrep', `%${domain}%`);
  }

  // Filter by name
  const name = searchParams.get('nom');
  if (name) {
    query = query.ilike('nom_entrep', `%${name}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate required fields
  if (!body.nom_entrep || !body.ville_entrep) {
    return NextResponse.json(
      { error: 'nom_entrep et ville_entrep sont requis' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from('entreprises').insert([
    {
      nom_entrep: body.nom_entrep,
      ville_entrep: body.ville_entrep,
      nom_respon: body.nom_respon,
      mail_respon: body.mail_respon,
      domaine_entrep: body.domaine_entrep,
      latitude: body.latitude,
      longitude: body.longitude,
    },
  ]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}
