"use client";

import { useState } from "react";
import type { FaqItem } from "@prisma/client";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { FaqFormModal } from "./FaqFormModal";

interface FaqManagerProps {
  initialFaqs: FaqItem[];
}

function truncate(text: string, length: number): string {
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

export function FaqManager({ initialFaqs }: FaqManagerProps) {
  const { showToast } = useToast();
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);

  const [formOpen, setFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [reorderingId, setReorderingId] = useState<string | null>(null);

  function openAddForm() {
    setEditingFaq(null);
    setFormOpen(true);
  }

  function openEditForm(faq: FaqItem) {
    setEditingFaq(faq);
    setFormOpen(true);
  }

  function handleSaved(saved: FaqItem) {
    setFormOpen(false);
    if (editingFaq) {
      setFaqs((prev) => prev.map((f) => (f.id === saved.id ? saved : f)));
      showToast("FAQ berhasil diperbarui");
    } else {
      setFaqs((prev) => [...prev, saved]);
      showToast("FAQ berhasil ditambahkan");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/faq/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error ?? "Gagal menghapus FAQ", "error");
        return;
      }
      setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      showToast("FAQ berhasil dihapus");
      setDeleteTarget(null);
    } catch {
      showToast("Gagal menghapus FAQ", "error");
    } finally {
      setDeleting(false);
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const current = faqs[index];
    const target = faqs[targetIndex];

    setReorderingId(current.id);
    try {
      const [resA, resB] = await Promise.all([
        fetch(`/api/admin/faq/${current.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: target.order }),
        }),
        fetch(`/api/admin/faq/${target.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: current.order }),
        }),
      ]);
      const [jsonA, jsonB] = await Promise.all([resA.json(), resB.json()]);
      if (!jsonA.success || !jsonB.success) {
        showToast("Gagal mengubah urutan", "error");
        return;
      }

      setFaqs((prev) => {
        const next = [...prev];
        next[index] = { ...current, order: target.order };
        next[targetIndex] = { ...target, order: current.order };
        next.sort((a, b) => a.order - b.order);
        return next;
      });
    } catch {
      showToast("Gagal mengubah urutan", "error");
    } finally {
      setReorderingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openAddForm}>
          <Plus size={16} />
          Tambah FAQ
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F1F5F9] text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Urutan</th>
              <th className="px-4 py-3">Pertanyaan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                  Belum ada FAQ. Tambahkan FAQ baru.
                </td>
              </tr>
            ) : (
              faqs.map((faq, index) => (
                <tr key={faq.id} className="border-b border-slate-100 hover:bg-[#EEF2F7]">
                  <td className="px-4 py-3 text-slate-500">{faq.order}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{truncate(faq.question, 60)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0 || reorderingId !== null}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 disabled:opacity-30"
                        aria-label="Naikkan urutan"
                        title="Naik"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMove(index, 1)}
                        disabled={index === faqs.length - 1 || reorderingId !== null}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 disabled:opacity-30"
                        aria-label="Turunkan urutan"
                        title="Turun"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        onClick={() => openEditForm(faq)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600"
                        aria-label="Edit FAQ"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(faq)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                        aria-label="Hapus FAQ"
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

      <FaqFormModal
        open={formOpen}
        faq={editingFaq}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onError={(msg) => showToast(msg, "error")}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus FAQ"
        description={`Hapus FAQ "${deleteTarget ? truncate(deleteTarget.question, 60) : ""}"?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
