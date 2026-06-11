import { prisma } from "@/lib/prisma";
import { TestimonialManager } from "@/components/admin/testimonial/TestimonialManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Testimonial</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola testimonial pelanggan yang ditampilkan di halaman utama.</p>
      </div>
      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  );
}
