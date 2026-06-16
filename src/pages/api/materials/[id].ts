import type { APIRoute } from 'astro';

export const prerender = false;

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user) return json({ error: 'Não autorizado.' }, 401);

  const { id } = params;
  if (!id) return json({ error: 'id é obrigatório.' }, 422);

  const supabase = locals.supabase;

  const { data: material } = await supabase
    .from('materials')
    .select('file_path')
    .eq('id', id)
    .single();

  if (!material) return json({ error: 'Material não encontrado.' }, 404);

  const { error: dbErr } = await supabase.from('materials').delete().eq('id', id);
  if (dbErr) return json({ error: dbErr.message }, 500);

  await supabase.storage.from('materials').remove([material.file_path]);

  return json({ ok: true }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
