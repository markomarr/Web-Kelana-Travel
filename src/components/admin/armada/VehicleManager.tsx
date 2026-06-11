"use client";

import { useState } from "react";
import Image from "next/image";
import type { Vehicle } from "@prisma/client";
import { Plus, Pencil, Trash2, Users, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { VehicleFormModal } from "./VehicleFormModal";

interface VehicleManagerProps {
  initialVehicles: Vehicle[];
}

function parseFacilities(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

export function VehicleManager({ initialVehicles }: VehicleManagerProps) {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  function openAddForm() {
    setEditingVehicle(null);
    setFormOpen(true);
  }

  function openEditForm(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setFormOpen(true);
  }

  function handleSaved(saved: Vehicle) {
    setFormOpen(false);
    if (editingVehicle) {
      setVehicles((prev) => prev.map((v) => (v.id === saved.id ? saved : v)));
      showToast("Armada berhasil diperbarui");
    } else {
      setVehicles((prev) => [saved, ...prev]);
      showToast("Armada berhasil ditambahkan");
    }
  }

  async function handleToggleActive(vehicle: Vehicle) {
    setTogglingId(vehicle.id);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !vehicle.isActive }),
      });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal mengubah status", "error");
        return;
      }
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? { ...v, isActive: json.data.isActive } : v))
      );
    } catch {
      showToast("Gagal mengubah status", "error");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal menghapus armada", "error");
        return;
      }
      setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      showToast("Armada berhasil dihapus");
      setDeleteTarget(null);
    } catch {
      showToast("Gagal menghapus armada", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openAddForm}>
          <Plus size={16} />
          Tambah Armada
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-slate-400 shadow-sm">
          Belum ada armada. Tambahkan armada baru.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => {
            const facilities = parseFacilities(vehicle.facilities);
            return (
              <div key={vehicle.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="relative h-40 w-full bg-slate-100">
                  {vehicle.photoUrl ? (
                    <Image
                      src={vehicle.photoUrl}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <ImageOff size={32} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-800">{vehicle.name}</h3>
                    <button
                      onClick={() => handleToggleActive(vehicle)}
                      disabled={togglingId === vehicle.id}
                      className="disabled:opacity-50"
                    >
                      <StatusBadge active={vehicle.isActive} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Users size={14} />
                    <span>{vehicle.capacity} penumpang</span>
                  </div>

                  {vehicle.description && (
                    <p className="line-clamp-2 text-sm text-slate-500">{vehicle.description}</p>
                  )}

                  {facilities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {facilities.map((facility) => (
                        <span
                          key={facility}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 flex justify-end gap-1 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => openEditForm(vehicle)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600"
                      aria-label="Edit armada"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(vehicle)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                      aria-label="Hapus armada"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <VehicleFormModal
        open={formOpen}
        vehicle={editingVehicle}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onError={(msg) => showToast(msg, "error")}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Armada"
        description={`Hapus armada "${deleteTarget?.name ?? ""}"? Foto yang sudah diunggah tetap tersimpan di Media.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
