import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ params, request, locals }) => {
  const { id } = params;
  if (!id) return json({ error: 'id é obrigatório.' }, 422);

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Corpo inválido.' }, 400);
  }

  const { name, email, phone } = body;

  if (!name?.trim() || name.trim().length < 2) {
    return json({ error: 'Nome é obrigatório (mínimo 2 caracteres).' }, 422);
  }

  const hasEmail = !!email?.trim();
  const hasPhone = !!phone?.trim();

  if (!hasEmail && !hasPhone) {
    return json({ error: 'Informe e-mail ou WhatsApp.' }, 422);
  }

  if (hasEmail) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.trim())) {
      return json({ error: 'E-mail inválido.' }, 422);
    }
  }

  if (hasPhone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      return json({ error: 'WhatsApp inválido (mínimo 10 dígitos).' }, 422);
    }
  }

  const supabase = locals.supabase;

  const { data: form, error: formErr } = await supabase
    .from('forms')
    .select('id, name, source_tag, service_interest')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (formErr || !form) return json({ error: 'Formulário não encontrado ou inativo.' }, 404);

  const contactData = {
    name: name.trim(),
    phone: hasPhone ? phone.replace(/\D/g, '').replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3') : null,
    message: `Formulário: ${form.name}`,
    service_interest: form.service_interest ?? null,
    source: form.source_tag,
  };

  if (hasEmail) {
    await supabase
      .from('contacts')
      .upsert({ ...contactData, email: email.trim().toLowerCase() }, { onConflict: 'email' });
  } else {
    await supabase
      .from('contacts')
      .insert({ ...contactData, email: `phone_${Date.now()}@noemail.local` });
  }

  return json({ ok: true }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
