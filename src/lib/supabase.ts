import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase untuk server-side (API routes, server components).
 * Menggunakan service role key — JANGAN gunakan di client.
 */
export function createServerClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

/**
 * Client Supabase untuk browser/client component.
 * Menggunakan anon key — aman untuk diekspos ke client.
 */
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
