import { prisma } from "@/lib/prisma";
import { FaqManager } from "@/components/admin/faq/FaqManager";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const faqs = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">FAQ</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola pertanyaan yang sering diajukan beserta urutannya.</p>
      </div>
      <FaqManager initialFaqs={faqs} />
    </div>
  );
}
