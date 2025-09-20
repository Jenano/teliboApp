import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function supabaseServer() {
  // `cookies()` is synchronous in App Router. Create the client per-request
  // and allow Supabase to read/write auth cookies via get/set/delete.
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) {
    throw new Error(
      'Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).'
    );
  }

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: Parameters<typeof cookieStore.set>[2]) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options?: Parameters<typeof cookieStore.set>[2]) {
        try {
          cookieStore.delete(name);
        } catch {
          cookieStore.set(name, '', { ...(options || {}), maxAge: 0 });
        }
      },
    },
  });
}
