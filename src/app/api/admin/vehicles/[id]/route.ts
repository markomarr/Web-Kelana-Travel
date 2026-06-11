import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) return fail("Armada tidak ditemukan", 404);
  return ok(vehicle);
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, capacity, description, facilities, photoUrl, isActive } = body;

    if (capacity !== undefined) {
      const capacityNum = Number(capacity);
      if (!Number.isInteger(capacityNum) || capacityNum <= 0) {
        return fail("Kapasitas harus berupa angka positif");
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(capacity !== undefined && { capacity: Number(capacity) }),
        ...(description !== undefined && { description: description || null }),
        ...(facilities !== undefined && { facilities }),
        ...(photoUrl !== undefined && { photoUrl: photoUrl || null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return ok(vehicle);
  } catch {
    return fail("Gagal memperbarui armada", 500);
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    await prisma.vehicle.delete({ where: { id } });
    return ok({ id });
  } catch {
    return fail("Gagal menghapus armada", 500);
  }
}
