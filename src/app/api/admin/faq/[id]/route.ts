import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const faq = await prisma.faqItem.findUnique({ where: { id } });
  if (!faq) return fail("FAQ tidak ditemukan", 404);
  return ok(faq);
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { question, answer, order } = body;

    const faq = await prisma.faqItem.update({
      where: { id },
      data: {
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return ok(faq);
  } catch {
    return fail("Gagal memperbarui FAQ", 500);
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const { id } = await params;
    await prisma.faqItem.delete({ where: { id } });
    return ok({ id });
  } catch {
    return fail("Gagal menghapus FAQ", 500);
  }
}
