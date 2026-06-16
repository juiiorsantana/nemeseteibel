import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('\nUso: node scripts/create-admin.mjs <email> <senha>\n');
  process.exit(1);
}

// Lê o .env manualmente
const env = Object.fromEntries(
  readFileSync('.env', 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const [key, ...rest] = l.split('=');
      return [key.trim(), rest.join('=').trim().replace(/^"|"$/g, '')];
    })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Procura usuário existente pelo e-mail
const { data: list, error: listError } = await supabase.auth.admin.listUsers();
if (listError) {
  console.error('\nErro ao listar usuários:', listError.message, '\n');
  process.exit(1);
}

const existing = list.users.find(u => u.email === email);

if (existing) {
  const { error } = await supabase.auth.admin.updateUserById(existing.id, { password });
  if (error) {
    console.error('\nErro ao atualizar senha:', error.message, '\n');
    process.exit(1);
  }
  console.log(`\nSenha do admin ${email} atualizada com sucesso!\n`);
} else {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error('\nErro ao criar admin:', error.message, '\n');
    process.exit(1);
  }
  console.log(`\nAdmin ${email} criado com sucesso!\n`);
}
