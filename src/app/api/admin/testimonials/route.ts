import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ok(testimonials);
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const body = await request.json();
    const { name, rating, review, routeUsed, photoUrl, published } = body;

    if (!name || !rating || !review) {
      return fail("Nama, rating, dan ulasan wajib diisi");
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return fail("Rating harus antara 1-5");
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        rating: ratingNum,
        review,
        routeUsed: routeUsed || null,
        photoUrl: photoUrl || null,
        published: published ?? false,
      },
    });

    return ok(testimonial, 201);
  } catch {
    return fail("Gagal membuat testimonial", 500);
  }
}
