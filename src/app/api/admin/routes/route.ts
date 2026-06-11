import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const routes = await prisma.route.findMany({
    orderBy: { createdAt: "desc" },
    include: { prices: { include: { vehicle: true } } },
  });

  return ok(routes);
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const body = await request.json();
    const { cityFrom, cityTo, durationEst, isActive } = body;

    if (!cityFrom || !cityTo) {
      return fail("Kota asal dan kota tujuan wajib diisi");
    }

    const route = await prisma.route.create({
      data: {
        cityFrom,
        cityTo,
        durationEst: durationEst || null,
        isActive: isActive ?? true,
      },
    });

    return ok(route, 201);
  } catch {
    return fail("Gagal membuat rute", 500);
  }
}
