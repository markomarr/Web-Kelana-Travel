import Link from "next/link";
import { Route, Bus, MessageSquareQuote, HelpCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  const userName = session?.user?.name ?? session?.user?.email ?? "Admin";

  const [activeRoutes, totalVehicles, publishedTestimonials, totalFaq] = await Promise.all([
    prisma.route.count({ where: { isActive: true } }),
    prisma.vehicle.count(),
    prisma.testimonial.count({ where: { published: true } }),
    prisma.faqItem.count(),
  ]);

  const stats = [
    { label: "Total Rute Aktif", value: activeRoutes, icon: Route },
    { label: "Total Armada", value: totalVehicles, icon: Bus },
    { label: "Testimonial Published", value: publishedTestimonials, icon: MessageSquareQuote },
    { label: "Total FAQ", value: totalFaq, icon: HelpCircle },
  ];

  const quickActions = [
    { href: "/admin/rute", label: "Kelola Rute & Harga" },
    { href: "/admin/armada", label: "Kelola Armada" },
    { href: "/admin/testimonial", label: "Kelola Testimonial" },
    { href: "/admin/faq", label: "Kelola FAQ" },
    { href: "/admin/media", label: "File Manager" },
    { href: "/admin/settings", label: "Pengaturan Website" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Selamat datang, {userName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan konten website Kelana Travel saat ini.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-600/10 p-2.5 text-primary-600">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-800">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-primary-600 hover:bg-primary-600/5 hover:text-primary-600"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
