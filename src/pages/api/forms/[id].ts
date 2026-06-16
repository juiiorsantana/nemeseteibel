import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const { id } = params;
  if (!id) return json({ error: 'id é obrigatório.' }, 422);

  const { data: form, error } = await locals.supabase
    .from('forms')
    .select('id, title, subtitle, success_message')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !form) return json({ error: 'Formulário não encontrado.' }, 404);

  return json(form, 200);
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user) return json({ error: 'Não autorizado.' }, 401);

  const { id } = params;
  if (!id) return json({ error: 'id é obrigatório.' }, 422);

  const { error } = await locals.supabase.from('forms').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);

  return json({ ok: true }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
