import { createServerClient } from "@/lib/supabase";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";
import { MEDIA_BUCKET } from "@/lib/constants";

type Params = Promise<{ path: string[] }>;

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { path } = await params;
    const filePath = path.map(decodeURIComponent).join("/");

    const supabase = createServerClient();
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([filePath]);

    if (error) {
      return fail("Gagal menghapus file", 500);
    }

    return ok({ path: filePath });
  } catch {
    return fail("Gagal menghapus file", 500);
  }
}
