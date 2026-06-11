import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return ok(settings);
}

export async function PUT(request: Request) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const body = await request.json();
    const {
      siteName,
      phoneWhatsapp,
      phoneDisplay,
      email,
      address,
      mapsEmbedUrl,
      heroTagline,
      heroSubtext,
      heroImageUrl,
    } = body;

    if (!siteName || !phoneWhatsapp || !phoneDisplay || !heroTagline) {
      return fail("Nama bisnis, nomor WA, nomor tampilan, dan tagline hero wajib diisi");
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        siteName,
        phoneWhatsapp,
        phoneDisplay,
        email: email || null,
        address: address || null,
        mapsEmbedUrl: mapsEmbedUrl || null,
        heroTagline,
        heroSubtext: heroSubtext || null,
        heroImageUrl: heroImageUrl || null,
      },
      create: {
        id: 1,
        siteName,
        phoneWhatsapp,
        phoneDisplay,
        email: email || null,
        address: address || null,
        mapsEmbedUrl: mapsEmbedUrl || null,
        heroTagline,
        heroSubtext: heroSubtext || null,
        heroImageUrl: heroImageUrl || null,
      },
    });

    return ok(settings);
  } catch {
    return fail("Gagal menyimpan pengaturan", 500);
  }
}
