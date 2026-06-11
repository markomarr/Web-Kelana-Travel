import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ok(vehicles);
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const body = await request.json();
    const { name, capacity, description, facilities, photoUrl, isActive } = body;

    if (!name || !capacity) {
      return fail("Nama dan kapasitas wajib diisi");
    }

    const capacityNum = Number(capacity);
    if (!Number.isInteger(capacityNum) || capacityNum <= 0) {
      return fail("Kapasitas harus berupa angka positif");
    }

    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.vehicle.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        slug,
        capacity: capacityNum,
        description: description || null,
        facilities: facilities ?? [],
        photoUrl: photoUrl || null,
        isActive: isActive ?? true,
      },
    });

    return ok(vehicle, 201);
  } catch {
    return fail("Gagal membuat armada", 500);
  }
}
