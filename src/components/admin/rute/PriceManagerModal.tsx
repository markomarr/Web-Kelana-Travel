"use client";

import { useEffect, useState } from "react";
import type { RoutePrice, Vehicle, Route } from "@prisma/client";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatRupiah } from "@/lib/utils";

type PriceWithVehicle = RoutePrice & { vehicle: Vehicle };

interface PriceManagerModalProps {
  open: boolean;
  route: Route | null;
  vehicles: Vehicle[];
  onClose: () => void;
  onPricesChanged: (routeId: string, prices: PriceWithVehicle[]) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function PriceManagerModal({
  open,
  route,
  vehicles,
  onClose,
  onPricesChanged,
  onError,
  onSuccess,
}: PriceManagerModalProps) {
  const [prices, setPrices] = useState<PriceWithVehicle[]>([]);
  const [loading, setLoading] = useState(false);

  const [newVehicleId, setNewVehicleId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<PriceWithVehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open || !route) return;
    setLoading(true);
    fetch(`/api/admin/routes/${route.id}/prices`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPrices(json.data);
      })
      .finally(() => setLoading(false));
    setNewVehicleId("");
    setNewPrice("");
    setEditingId(null);
  }, [open, route]);

  if (!route) return null;

  const availableVehicles = vehicles.filter(
    (v) => !prices.some((p) => p.vehicleId === v.id)
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newVehicleId || !newPrice) {
      onError("Pilih armada dan isi harga");
      return;
    }
    const priceNum = Number(newPrice);
    if (!Number.isInteger(priceNum) || priceNum < 0) {
      onError("Harga harus berupa angka positif");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch(`/api/admin/routes/${route!.id}/prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId: newVehicleId, price: priceNum }),
      });
      const json = await res.json();
      if (!json.success) {
        onError(json.error ?? "Gagal menambahkan harga");
        return;
      }
      const next = [...prices, json.data];
      setPrices(next);
      onPricesChanged(route!.id, next);
      onSuccess("Harga berhasil ditambahkan");
      setNewVehicleId("");
      setNewPrice("");
    } catch {
      onError("Gagal menambahkan harga");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(price: PriceWithVehicle) {
    setEditingId(price.id);
    setEditPrice(String(price.price));
  }

  async function handleSaveEdit(priceId: string) {
    const priceNum = Number(editPrice);
    if (!Number.isInteger(priceNum) || priceNum < 0) {
      onError("Harga harus berupa angka positif");
      return;
    }
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/routes/${route!.id}/prices/${priceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: priceNum }),
      });
      const json = await res.json();
      if (!json.success) {
        onError(json.error ?? "Gagal memperbarui harga");
        return;
      }
      const next = prices.map((p) => (p.id === priceId ? json.data : p));
      setPrices(next);
      onPricesChanged(route!.id, next);
      onSuccess("Harga berhasil diperbarui");
      setEditingId(null);
    } catch {
      onError("Gagal memperbarui harga");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/routes/${route!.id}/prices/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) {
        onError(json.error ?? "Gagal menghapus harga");
        return;
      }
      const next = prices.filter((p) => p.id !== deleteTarget.id);
      setPrices(next);
      onPricesChanged(route!.id, next);
      onSuccess("Harga berhasil dihapus");
      setDeleteTarget(null);
    } catch {
      onError("Gagal menghapus harga");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Kelola Harga — ${route.cityFrom} → ${route.cityTo}`}
    >
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat harga...</p>
        ) : prices.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada harga untuk rute ini.</p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {prices.map((price) => (
              <li key={price.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <span className="text-sm font-medium text-slate-700">{price.vehicle.name}</span>
                {editingId === price.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-28 rounded-lg border border-slate-200 px-2 py-1 text-sm font-mono outline-none focus:border-primary-600"
                    />
                    <button
                      onClick={() => handleSaveEdit(price.id)}
                      disabled={savingEdit}
                      className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50"
                      aria-label="Simpan"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                      aria-label="Batal"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-slate-800">
                      {formatRupiah(price.price)}
                    </span>
                    <button
                      onClick={() => startEdit(price)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600"
                      aria-label="Edit harga"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(price)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                      aria-label="Hapus harga"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {availableVehicles.length > 0 ? (
          <form onSubmit={handleAdd} className="flex flex-col gap-3 rounded-lg border border-dashed border-slate-300 p-3">
            <p className="text-sm font-medium text-slate-700">Tambah Harga Baru</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Select
                  label="Armada"
                  value={newVehicleId}
                  onChange={(e) => setNewVehicleId(e.target.value)}
                >
                  <option value="">Pilih armada</option>
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-slate-700">Harga (Rp)</label>
                <input
                  type="number"
                  min={0}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="150000"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none focus:border-primary-600"
                />
                {newPrice && !Number.isNaN(Number(newPrice)) && (
                  <p className="mt-1 text-xs text-slate-500">{formatRupiah(Number(newPrice))}</p>
                )}
              </div>
              <Button type="submit" loading={adding}>
                Tambah
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-slate-400">Semua armada sudah memiliki harga di rute ini.</p>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Harga"
        description={`Hapus harga untuk ${deleteTarget?.vehicle.name ?? ""} di rute ini?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Modal>
  );
}
