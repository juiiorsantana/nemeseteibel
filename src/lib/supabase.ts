import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

// Astro 4.x AstroCookies does NOT have getAll().
// getAll() is implemented by parsing the raw Cookie request header.
// setAll() uses cookies.set(), which exists in all Astro versions.
export function createSupabaseServerClient(
  request: Request,
  cookies: AstroCookies,
): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? import.meta.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios no .env');
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        const header = request.headers.get('cookie') ?? '';
        if (!header) return [];
        return header
          .split(';')
          .map(c => c.trim())
          .filter(Boolean)
          .map(c => {
            const eq = c.indexOf('=');
            if (eq === -1) return { name: c.trim(), value: '' };
            return { name: c.slice(0, eq).trim(), value: c.slice(eq + 1).trim() };
          });
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options as CookieOptions);
        });
      },
    },
  });
}

export function createSupabaseAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env');
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
