"use client";

import { useState } from "react";
import type { Testimonial } from "@prisma/client";
import { Plus, Pencil, Trash2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { TestimonialFormModal } from "./TestimonialFormModal";

const PAGE_SIZE = 10;

interface TestimonialManagerProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialManager({ initialTestimonials }: TestimonialManagerProps) {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(testimonials.length / PAGE_SIZE));
  const pageItems = testimonials.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddForm() {
    setEditingTestimonial(null);
    setFormOpen(true);
  }

  function openEditForm(testimonial: Testimonial) {
    setEditingTestimonial(testimonial);
    setFormOpen(true);
  }

  function handleSaved(saved: Testimonial) {
    setFormOpen(false);
    if (editingTestimonial) {
      setTestimonials((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
      showToast("Testimonial berhasil diperbarui");
    } else {
      setTestimonials((prev) => [saved, ...prev]);
      showToast("Testimonial berhasil ditambahkan");
      setPage(1);
    }
  }

  async function handleTogglePublished(testimonial: Testimonial) {
    setTogglingId(testimonial.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !testimonial.published }),
      });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal mengubah status", "error");
        return;
      }
      setTestimonials((prev) =>
        prev.map((t) => (t.id === testimonial.id ? { ...t, published: json.data.published } : t))
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
      const res = await fetch(`/api/admin/testimonials/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal menghapus testimonial", "error");
        return;
      }
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      showToast("Testimonial berhasil dihapus");
      setDeleteTarget(null);
    } catch {
      showToast("Gagal menghapus testimonial", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openAddForm}>
          <Plus size={16} />
          Tambah Testimonial
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F1F5F9] text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Rute</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Belum ada testimonial. Tambahkan testimonial baru.
                </td>
              </tr>
            ) : (
              pageItems.map((testimonial) => (
                <tr key={testimonial.id} className="border-b border-slate-100 hover:bg-[#EEF2F7]">
                  <td className="px-4 py-3 font-medium text-slate-800">{testimonial.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          fill={star <= testimonial.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{testimonial.routeUsed || "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublished(testimonial)}
                      disabled={togglingId === testimonial.id}
                      className="disabled:opacity-50"
                    >
                      <StatusBadge
                        active={testimonial.published}
                        activeLabel="Published"
                        inactiveLabel="Draft"
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditForm(testimonial)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600"
                        aria-label="Edit testimonial"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(testimonial)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                        aria-label="Hapus testimonial"
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

      <TestimonialFormModal
        open={formOpen}
        testimonial={editingTestimonial}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onError={(msg) => showToast(msg, "error")}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Testimonial"
        description={`Hapus testimonial dari "${deleteTarget?.name ?? ""}"?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
