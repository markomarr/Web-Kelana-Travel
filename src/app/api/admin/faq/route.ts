import { prisma } from "@/lib/prisma";
import { requireSession, unauthorized, ok, fail } from "@/lib/api-utils";

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const faqs = await prisma.faqItem.findMany({
    orderBy: { order: "asc" },
  });

  return ok(faqs);
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const body = await request.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return fail("Pertanyaan dan jawaban wajib diisi");
    }

    const last = await prisma.faqItem.findFirst({ orderBy: { order: "desc" } });
    const nextOrder = (last?.order ?? 0) + 1;

    const faq = await prisma.faqItem.create({
      data: { question, answer, order: nextOrder },
    });

    return ok(faq, 201);
  } catch {
    return fail("Gagal membuat FAQ", 500);
  }
}
