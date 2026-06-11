import { createServerClient } from "@/lib/supabase";
import { MEDIA_BUCKET } from "@/lib/constants";

export interface FileEntry {
  name: string;
  path: string;
  url: string;
  size: number;
  createdAt: string | null;
}

export async function listAllFiles(
  supabase: ReturnType<typeof createServerClient>,
  prefix = "",
  depth = 0
): Promise<FileEntry[]> {
  if (depth > 3) return [];

  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(prefix, {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error || !data) return [];

  const files: FileEntry[] = [];
  for (const item of data) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id === null) {
      const sub = await listAllFiles(supabase, path, depth + 1);
      files.push(...sub);
    } else {
      const { data: urlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      files.push({
        name: item.name,
        path,
        url: urlData.publicUrl,
        size: item.metadata?.size ?? 0,
        createdAt: item.created_at ?? null,
      });
    }
  }
  return files;
}

export async function listAllFilesSorted(supabase: ReturnType<typeof createServerClient>): Promise<FileEntry[]> {
  const files = await listAllFiles(supabase);
  files.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  return files;
}
