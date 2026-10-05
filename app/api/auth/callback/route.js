import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('redirectTo') || '/admin';

  if (code) {
    let response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookieOptions: {
          maxAge: 60 * 60 * 24 * 365,
          sameSite: 'lax',
          path: '/',
        },
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.redirect(`${origin}${next}`);
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, {
                ...options,
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax',
                path: '/',
              })
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const userEmail = data.user.email?.toLowerCase().trim();

      // Authorized admin Google accounts
      const allowedAdminEmails = [
        'rcubesdesign@gmail.com',
        'arrazajan@gmail.com',
        'admin@srjstudio.com',
        (process.env.ADMIN_EMAIL || '').toLowerCase().trim(),
      ].filter(Boolean);

      const isAuthorized =
        allowedAdminEmails.includes(userEmail) ||
        data.user.app_metadata?.role === 'admin' ||
        data.user.user_metadata?.role === 'admin';

      if (isAuthorized) {
        return response;
      }

      // If signed in with an unauthorized Google account, sign out and show error
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/admin/login?error=${encodeURIComponent(
          `Unauthorized Google account (${userEmail}). Access is restricted to verified studio administrators.`
        )}`
      );
    }
  }

  const errorDesc = searchParams.get('error_description') || 'Google authentication was not completed.';
  return NextResponse.redirect(
    `${origin}/admin/login?error=${encodeURIComponent(errorDesc)}`
  );
}
