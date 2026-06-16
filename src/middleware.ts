import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname === '/api/health') {
    return next();
  }

  let supabase;
  try {
    supabase = createSupabaseServerClient(context.request, context.cookies);
  } catch (e: any) {
    return new Response(JSON.stringify({ middleware: 'createClient failed', error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  context.locals.supabase = supabase;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return context.redirect('/admin/login');
      }

      context.locals.user = user;
    } catch (e: any) {
      return new Response(JSON.stringify({ middleware: 'getUser failed', error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return next();
});
