import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  // locals.supabase is always set by middleware (runs before all routes)
  const supabase = locals.supabase;

  let body: Record<string, string>;
  try {
    const ct = request.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      body = await request.json();
    } else {
      const fd = await request.formData();
      body = Object.fromEntries(fd.entries()) as Record<string, string>;
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Corpo inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, phone, message, service_interest, source } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return new Response(
      JSON.stringify({ error: 'Nome, e-mail e mensagem são obrigatórios.' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(
      JSON.stringify({ error: 'E-mail inválido.' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { error } = await supabase.from('contacts').insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    message: message.trim(),
    service_interest: service_interest?.trim() || null,
    source: source?.trim() || 'site',
  });

  if (error) {
    console.error('[contacts/submit]', error.message);
    return new Response(
      JSON.stringify({ error: 'Erro ao salvar. Tente novamente.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
