import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const route = await prisma.route.findUnique({
    where: { id },
    include: { prices: { include: { vehicle: true } } },
  });

  if (!route) return fail("Rute tidak ditemukan", 404);
  return ok(route);
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { cityFrom, cityTo, durationEst, isActive } = body;

    const route = await prisma.route.update({
      where: { id },
      data: {
        ...(cityFrom !== undefined && { cityFrom }),
        ...(cityTo !== undefined && { cityTo }),
        ...(durationEst !== undefined && { durationEst: durationEst || null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return ok(route);
  } catch {
    return fail("Gagal memperbarui rute", 500);
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    await prisma.route.delete({ where: { id } });
    return ok({ id });
  } catch {
    return fail("Gagal menghapus rute", 500);
  }
}
