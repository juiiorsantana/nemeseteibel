import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Corpo inválido.' }, 400);
  }

  const { material_id, name, email, phone, source } = body;

  if (!material_id || !name?.trim()) return json({ error: 'material_id e nome são obrigatórios.' }, 422);
  if (!email?.trim() && !phone?.trim()) return json({ error: 'Informe e-mail ou WhatsApp.' }, 422);

  const supabase = locals.supabase;

  // Busca o material (RLS: só retorna se is_active = true)
  const { data: material, error: matErr } = await supabase
    .from('materials')
    .select('id, file_path')
    .eq('id', material_id)
    .single();

  if (matErr || !material) return json({ error: 'Material não encontrado.' }, 404);

  // Salva lead em contacts
  let contactId: string | null = null;
  const base = {
    name: name.trim(),
    phone: phone?.trim() || null,
    message: 'Download de material',
    service_interest: 'material-download',
    source: source?.trim() || 'materiais',
  };

  if (email?.trim()) {
    const { data: contact } = await supabase
      .from('contacts')
      .upsert({ ...base, email: email.trim().toLowerCase() }, { onConflict: 'email' })
      .select('id')
      .single();
    contactId = contact?.id ?? null;
  } else {
    const { data: contact } = await supabase
      .from('contacts')
      .insert({ ...base, email: `phone_${Date.now()}@noemail.local` })
      .select('id')
      .single();
    contactId = contact?.id ?? null;
  }

  // Registra o download
  await supabase.from('material_downloads').insert({
    material_id,
    contact_id: contactId,
    name: name.trim(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    source: source?.trim() || 'materiais',
  });

  // Incrementa contador (RPC SECURITY DEFINER — funciona com anon)
  await supabase.rpc('increment_download_count', { material_id });

  // Gera signed URL (60s) — funciona com anon graças à policy public_read_materials
  const { data: signed, error: signErr } = await supabase.storage
    .from('materials')
    .createSignedUrl(material.file_path, 60);

  if (signErr || !signed?.signedUrl) {
    console.error('[materials/download]', signErr?.message);
    return json({ error: 'Erro ao gerar link de download.' }, 500);
  }

  return json({ signedUrl: signed.signedUrl }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
