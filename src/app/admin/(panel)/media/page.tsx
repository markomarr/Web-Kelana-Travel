import { createServerClient } from "@/lib/supabase";
import { listAllFilesSorted } from "@/lib/media";
import { MediaManager } from "@/components/admin/media/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const supabase = createServerClient();
  const files = await listAllFilesSorted(supabase);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Media</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola file gambar yang tersimpan di Supabase Storage.</p>
      </div>
      <MediaManager initialFiles={files} />
    </div>
  );
}
