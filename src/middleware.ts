import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createSupabaseServerClient(context.request, context.cookies);
  context.locals.supabase = supabase;

  const { pathname } = context.url;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return context.redirect('/admin/login');
    }

    context.locals.user = user;
  }

  const normalizedPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  if (
    !normalizedPath.startsWith('/admin') &&
    !normalizedPath.startsWith('/api') &&
    normalizedPath !== '/' &&
    normalizedPath !== '/indisponivel'
  ) {
    const { data } = await supabase
      .from('page_settings')
      .select('is_active')
      .eq('slug', normalizedPath)
      .maybeSingle();

    if (data && !data.is_active) {
      return context.redirect('/indisponivel');
    }
  }

  return next();
});
