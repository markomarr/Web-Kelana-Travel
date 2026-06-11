import Image from "next/image";
import { Bus, Users } from "lucide-react";
import { FACILITY_ICONS, parseFacilities } from "@/lib/facilities";
import type { Vehicle } from "@prisma/client";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const facilities = parseFacilities(vehicle.facilities);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-shadow duration-200 ease-out hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-primary">
        {vehicle.photoUrl ? (
          <Image
            src={vehicle.photoUrl}
            alt={`Foto armada ${vehicle.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/70">
            <Bus size={48} aria-hidden />
            <span className="sr-only">Foto armada {vehicle.name} belum tersedia</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-text-primary">{vehicle.name}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-primary">
            <Users size={14} />
            {vehicle.capacity} penumpang
          </span>
        </div>

        {vehicle.description && (
          <p className="mt-2 text-sm text-text-secondary">{vehicle.description}</p>
        )}

        {facilities.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {facilities.map((facility) => {
              const Icon = FACILITY_ICONS[facility];
              return (
                <li
                  key={facility}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-secondary"
                >
                  {Icon && <Icon size={14} className="text-primary-600" />}
                  {facility}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
