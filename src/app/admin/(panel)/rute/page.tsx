import { prisma } from "@/lib/prisma";
import { RouteManager } from "@/components/admin/rute/RouteManager";

export const dynamic = "force-dynamic";

export default async function AdminRoutePage() {
  const [routes, vehicles] = await Promise.all([
    prisma.route.findMany({
      orderBy: { createdAt: "desc" },
      include: { prices: { include: { vehicle: true } } },
    }),
    prisma.vehicle.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Rute & Harga</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola daftar rute beserta harga per armada.
        </p>
      </div>
      <RouteManager initialRoutes={routes} vehicles={vehicles} />
    </div>
  );
}
