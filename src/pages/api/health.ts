export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies }) => {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    envCheck: {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'set' : 'MISSING',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'set' : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'MISSING',
    },
  };

  try {
    const supabase = createSupabaseServerClient(request, cookies);
    diagnostics.clientCreated = true;

    const { data, error } = await supabase.auth.getUser();
    diagnostics.authCheck = { hasUser: !!data?.user, error: error?.message ?? null };

    const { error: dbErr } = await supabase.from('contacts').select('id', { count: 'exact', head: true });
    diagnostics.dbCheck = { success: !dbErr, error: dbErr?.message ?? null };
  } catch (e: any) {
    diagnostics.clientCreated = false;
    diagnostics.error = { message: e.message, stack: e.stack?.split('\n').slice(0, 5) };
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
