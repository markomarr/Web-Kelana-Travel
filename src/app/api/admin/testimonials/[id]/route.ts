import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return fail("Testimonial tidak ditemukan", 404);
  return ok(testimonial);
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, rating, review, routeUsed, photoUrl, published } = body;

    if (rating !== undefined) {
      const ratingNum = Number(rating);
      if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return fail("Rating harus antara 1-5");
      }
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(review !== undefined && { review }),
        ...(routeUsed !== undefined && { routeUsed: routeUsed || null }),
        ...(photoUrl !== undefined && { photoUrl: photoUrl || null }),
        ...(published !== undefined && { published }),
      },
    });

    return ok(testimonial);
  } catch {
    return fail("Gagal memperbarui testimonial", 500);
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return ok({ id });
  } catch {
    return fail("Gagal menghapus testimonial", 500);
  }
}
