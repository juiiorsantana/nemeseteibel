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

  if (
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api') &&
    pathname !== '/' &&
    pathname !== '/indisponivel'
  ) {
    const { data } = await supabase
      .from('page_settings')
      .select('is_active')
      .eq('slug', pathname)
      .maybeSingle();

    if (data && !data.is_active) {
      return context.redirect('/indisponivel');
    }
  }

  return next();
});
