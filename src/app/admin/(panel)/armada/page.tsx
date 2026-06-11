import { prisma } from "@/lib/prisma";
import { VehicleManager } from "@/components/admin/armada/VehicleManager";

export const dynamic = "force-dynamic";

export default async function AdminArmadaPage() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Armada</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola daftar kendaraan beserta foto dan fasilitas.</p>
      </div>
      <VehicleManager initialVehicles={vehicles} />
    </div>
  );
}
