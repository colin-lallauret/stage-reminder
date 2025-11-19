import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Supprimer toutes les entreprises
    const { error, count } = await supabase
      .from('entreprises')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Supprime tout sauf un ID impossible

    if (error) {
      console.error('Error deleting all enterprises:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Toutes les entreprises ont été supprimées',
      count: count 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la suppression' 
    }, { status: 500 });
  }
}
