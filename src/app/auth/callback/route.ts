import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/admin';

  if (code) {
    // AUTOMATED OAUTH PAYLOAD EXCHANGE:
    // This securely intercepts the Supabase/Google Auth code payload 
    // and exchanges it directly for a valid session token on the server.
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
    let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ok2RbNf7CZn-raMzL0Qtuw_U7qRB5M0';

    // Safeguard against invalid or missing env configurations during SSR
    if (!supabaseUrl.startsWith('http')) {
      supabaseUrl = 'https://krnsfelxtkpsiueuovwp.supabase.co';
    }
    if (!supabaseAnonKey || supabaseAnonKey.length < 10) {
      supabaseAnonKey = 'sb_publishable_ok2RbNf7CZn-raMzL0Qtuw_U7qRB5M0';
    }

    let supabaseResponse = NextResponse.redirect(new URL(next, request.url));

    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.redirect(new URL(next, request.url));
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error && data?.user?.email) {
        // Only send the welcome email if the user was created in the last 2 minutes
        const isNewUser = Date.now() - new Date(data.user.created_at).getTime() < 120000;
        
        if (isNewUser) {
          const { sendResendEmail } = await import('@/lib/emailService');
          await sendResendEmail({
            to: data.user.email,
            subject: 'WELCOME TO WORLDSTAR',
            html: `
              <div style="background-color: #000; color: #fff; padding: 40px; font-family: monospace;">
                <h1 style="color: #FA243C; text-transform: uppercase; letter-spacing: 2px;">Identity Verified</h1>
                <p>Welcome to the WORLDSTAR Artist Portal.</p>
                <p>Your secure profile has been provisioned. You can now deploy master submissions directly to our A&R pipeline.</p>
                <br/>
                <a href="https://worldstarhiphop.world/dashboard" style="background-color: #FA243C; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold;">ENTER DASHBOARD</a>
              </div>
            `,
          });
        }
        return supabaseResponse;
      }
    } catch (err) {
      console.error('SSR Auth Callback Error:', err);
    }
  }

  // Redirect back to login if there is an error
  const redirectUrl = new URL('/login', request.url);
  redirectUrl.searchParams.set('error', 'Authentication failed due to a server configuration issue');
  return NextResponse.redirect(redirectUrl);
}
