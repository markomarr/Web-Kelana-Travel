import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const prices = await prisma.routePrice.findMany({
    where: { routeId: id },
    include: { vehicle: true },
  });

  return ok(prices);
}

export async function POST(request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { vehicleId, price } = body;

    if (!vehicleId || price === undefined || price === null) {
      return fail("Armada dan harga wajib diisi");
    }

    const priceNum = Number(price);
    if (!Number.isInteger(priceNum) || priceNum < 0) {
      return fail("Harga harus berupa angka positif");
    }

    const routePrice = await prisma.routePrice.create({
      data: { routeId: id, vehicleId, price: priceNum },
      include: { vehicle: true },
    });

    return ok(routePrice, 201);
  } catch (e: unknown) {
    if (e instanceof Error && "code" in e && (e as { code?: string }).code === "P2002") {
      return fail("Harga untuk armada ini sudah ada di rute ini");
    }
    return fail("Gagal menambahkan harga", 500);
  }
}
