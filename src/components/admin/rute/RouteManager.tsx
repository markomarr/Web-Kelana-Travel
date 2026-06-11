"use client";

import { useState } from "react";
import type { Route, RoutePrice, Vehicle } from "@prisma/client";
import { Plus, Pencil, Trash2, Banknote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { RouteFormModal } from "./RouteFormModal";
import { PriceManagerModal } from "./PriceManagerModal";

type PriceWithVehicle = RoutePrice & { vehicle: Vehicle };
type RouteWithPrices = Route & { prices: PriceWithVehicle[] };

const PAGE_SIZE = 10;

interface RouteManagerProps {
  initialRoutes: RouteWithPrices[];
  vehicles: Vehicle[];
}

export function RouteManager({ initialRoutes, vehicles }: RouteManagerProps) {
  const { showToast } = useToast();
  const [routes, setRoutes] = useState<RouteWithPrices[]>(initialRoutes);
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const [priceRoute, setPriceRoute] = useState<RouteWithPrices | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<RouteWithPrices | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(routes.length / PAGE_SIZE));
  const pageRoutes = routes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddForm() {
    setEditingRoute(null);
    setFormOpen(true);
  }

  function openEditForm(route: Route) {
    setEditingRoute(route);
    setFormOpen(true);
  }

  function handleSaved(saved: Route) {
    setFormOpen(false);
    if (editingRoute) {
      setRoutes((prev) =>
        prev.map((r) => (r.id === saved.id ? { ...r, ...saved } : r))
      );
      showToast("Rute berhasil diperbarui");
    } else {
      setRoutes((prev) => [{ ...saved, prices: [] }, ...prev]);
      showToast("Rute berhasil ditambahkan");
      setPage(1);
    }
  }

  async function handleToggleActive(route: RouteWithPrices) {
    setTogglingId(route.id);
    try {
      const res = await fetch(`/api/admin/routes/${route.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !route.isActive }),
      });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal mengubah status", "error");
        return;
      }
      setRoutes((prev) =>
        prev.map((r) => (r.id === route.id ? { ...r, isActive: json.data.isActive } : r))
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
      const res = await fetch(`/api/admin/routes/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal menghapus rute", "error");
        return;
      }
      setRoutes((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast("Rute berhasil dihapus");
      setDeleteTarget(null);
    } catch {
      showToast("Gagal menghapus rute", "error");
    } finally {
      setDeleting(false);
    }
  }

  function handlePricesChanged(routeId: string, prices: PriceWithVehicle[]) {
    setRoutes((prev) => prev.map((r) => (r.id === routeId ? { ...r, prices } : r)));
    setPriceRoute((prev) => (prev && prev.id === routeId ? { ...prev, prices } : prev));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openAddForm}>
          <Plus size={16} />
          Tambah Rute
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F1F5F9] text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Rute</th>
              <th className="px-4 py-3">Durasi</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Jumlah Harga</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pageRoutes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Belum ada rute. Tambahkan rute baru.
                </td>
              </tr>
            ) : (
              pageRoutes.map((route, idx) => (
                <tr key={route.id} className="border-b border-slate-100 hover:bg-[#EEF2F7]">
                  <td className="px-4 py-3 text-slate-500">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {route.cityFrom} → {route.cityTo}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{route.durationEst || "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(route)}
                      disabled={togglingId === route.id}
                      className="disabled:opacity-50"
                    >
                      <StatusBadge active={route.isActive} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{route.prices.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setPriceRoute(route)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600"
                        aria-label="Kelola harga"
                        title="Kelola Harga"
                      >
                        <Banknote size={16} />
                      </button>
                      <button
                        onClick={() => openEditForm(route)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600"
                        aria-label="Edit rute"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(route)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                        aria-label="Hapus rute"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-50"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-50"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <RouteFormModal
        open={formOpen}
        route={editingRoute}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onError={(msg) => showToast(msg, "error")}
      />

      <PriceManagerModal
        open={!!priceRoute}
        route={priceRoute}
        vehicles={vehicles}
        onClose={() => setPriceRoute(null)}
        onPricesChanged={handlePricesChanged}
        onError={(msg) => showToast(msg, "error")}
        onSuccess={(msg) => showToast(msg)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Rute"
        description={`Hapus rute ${deleteTarget?.cityFrom ?? ""} → ${deleteTarget?.cityTo ?? ""}? Semua harga terkait akan ikut terhapus.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
