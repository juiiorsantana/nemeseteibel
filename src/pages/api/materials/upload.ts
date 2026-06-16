import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();
  if (!user) return json({ error: 'Não autorizado.' }, 401);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: 'Formulário inválido.' }, 400);
  }

  const file     = formData.get('file') as File | null;
  const title    = (formData.get('title') as string | null)?.trim();
  const desc     = (formData.get('description') as string | null)?.trim() || null;
  const category = (formData.get('category') as string | null)?.trim() || null;

  if (!file || !title) return json({ error: 'Arquivo e título são obrigatórios.' }, 422);

  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    return json({ error: 'Formato não permitido. Use PDF, JPG, PNG ou WebP.' }, 422);
  }

  const supabase = locals.supabase;
  const ext = file.name.split('.').pop() ?? 'bin';
  const filePath = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadErr } = await supabase.storage
    .from('materials')
    .upload(filePath, buffer, { contentType: file.type, upsert: false });

  if (uploadErr) {
    console.error('[materials/upload] storage:', uploadErr.message);
    return json({ error: 'Erro no upload do arquivo.' }, 500);
  }

  const { data: material, error: dbErr } = await supabase
    .from('materials')
    .insert({ title, description: desc, category, file_path: filePath, file_name: file.name, file_size: file.size })
    .select('id, title')
    .single();

  if (dbErr) {
    await supabase.storage.from('materials').remove([filePath]);
    console.error('[materials/upload] db:', dbErr.message);
    return json({ error: 'Erro ao salvar metadados.' }, 500);
  }

  return json({ id: material.id, title: material.title }, 201);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
