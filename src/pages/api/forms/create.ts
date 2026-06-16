import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user) return json({ error: 'Não autorizado.' }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Corpo inválido.' }, 400);
  }

  const { name, title, subtitle, source_tag, service_interest, success_message } = body as Record<string, string | null>;

  if (!name?.trim() || !title?.trim() || !source_tag?.trim()) {
    return json({ error: 'Nome, título e source tag são obrigatórios.' }, 422);
  }

  const tagClean = source_tag.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

  const { data: form, error } = await locals.supabase
    .from('forms')
    .insert({
      name: name.trim(),
      title: title.trim(),
      subtitle: subtitle?.trim() || null,
      source_tag: tagClean,
      service_interest: service_interest?.trim() || null,
      success_message: success_message?.trim() || 'Obrigado! Entraremos em contato em breve.',
    })
    .select('id, name')
    .single();

  if (error) {
    const msg = error.message.includes('unique') || error.code === '23505'
      ? 'Já existe um formulário com esse source tag. Use um diferente.'
      : error.message;
    return json({ error: msg }, 500);
  }

  return json({ id: form.id, name: form.name }, 201);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
