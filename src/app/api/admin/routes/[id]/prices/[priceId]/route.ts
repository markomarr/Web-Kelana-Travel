import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

type Params = Promise<{ id: string; priceId: string }>;

export async function PUT(request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { priceId } = await params;
    const body = await request.json();
    const { price } = body;

    const priceNum = Number(price);
    if (!Number.isInteger(priceNum) || priceNum < 0) {
      return fail("Harga harus berupa angka positif");
    }

    const routePrice = await prisma.routePrice.update({
      where: { id: priceId },
      data: { price: priceNum },
      include: { vehicle: true },
    });

    return ok(routePrice);
  } catch {
    return fail("Gagal memperbarui harga", 500);
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { priceId } = await params;
    await prisma.routePrice.delete({ where: { id: priceId } });
    return ok({ id: priceId });
  } catch {
    return fail("Gagal menghapus harga", 500);
  }
}
