import type { APIRoute } from 'astro';
import { createSupabaseAdminClient } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user) return json({ error: 'Não autorizado.' }, 401);

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Corpo inválido.' }, 400);
  }

  if (!body.id) return json({ error: 'id é obrigatório.' }, 422);

  const admin = createSupabaseAdminClient();

  const { data: current } = await admin
    .from('materials')
    .select('is_active')
    .eq('id', body.id)
    .single();

  if (!current) return json({ error: 'Material não encontrado.' }, 404);

  const { error } = await admin
    .from('materials')
    .update({ is_active: !current.is_active })
    .eq('id', body.id);

  if (error) return json({ error: error.message }, 500);

  return json({ is_active: !current.is_active }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
