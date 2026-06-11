import { createServerClient } from "@/lib/supabase";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";
import { listAllFilesSorted } from "@/lib/media";

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const supabase = createServerClient();
    const files = await listAllFilesSorted(supabase);
    return ok(files);
  } catch {
    return fail("Gagal memuat daftar file", 500);
  }
}
