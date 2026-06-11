import { createServerClient } from "@/lib/supabase";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES, MEDIA_BUCKET } from "@/lib/constants";
import { generateSlug } from "@/lib/utils";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string | null)?.trim() || "uploads";

    if (!(file instanceof File)) {
      return fail("File tidak ditemukan");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return fail("Hanya menerima JPG, PNG, atau WebP");
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return fail("Ukuran file maksimal 2MB");
    }

    const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "");
    const ext = EXT_BY_TYPE[file.type];
    const baseName = generateSlug(file.name.replace(/\.[^.]+$/, "")) || "file";
    const path = `${safeFolder}/${Date.now()}-${baseName}.${ext}`;

    const supabase = createServerClient();
    const arrayBuffer = await file.arrayBuffer();

    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return fail("Gagal mengunggah file", 500);
    }

    const { data: urlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    return ok({ path, url: urlData.publicUrl }, 201);
  } catch {
    return fail("Gagal mengunggah file", 500);
  }
}
