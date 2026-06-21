import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user) return json({ error: 'Não autorizado.' }, 401);

  let body: { slug?: string; is_active?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Corpo inválido.' }, 400);
  }

  if (!body.slug || typeof body.is_active !== 'boolean') {
    return json({ error: 'slug e is_active são obrigatórios.' }, 422);
  }

  const { error } = await locals.supabase
    .from('page_settings')
    .upsert(
      { slug: body.slug, is_active: body.is_active, updated_at: new Date().toISOString() },
      { onConflict: 'slug' },
    );

  if (error) return json({ error: error.message }, 500);

  return json({ slug: body.slug, is_active: body.is_active }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
