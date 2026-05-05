"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminModal } from "./AdminModal";
import { AdminItemRow } from "./AdminItemRow";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import type { DbLoafType } from "@/utils/supabase/types";

const inputClass =
  "w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm";

interface LoafTypesSectionProps {
  initialLoafTypes: DbLoafType[];
  onAdd?: (item: DbLoafType) => void;
  onUpdate?: (item: DbLoafType) => void;
  onDelete?: (id: string) => void;
}

export function LoafTypesSection({ initialLoafTypes, onAdd, onUpdate, onDelete: onDeleteProp }: LoafTypesSectionProps) {
  const supabase = createClient();
  const [loafTypes, setLoafTypes] = useState<DbLoafType[]>(initialLoafTypes);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<DbLoafType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DbLoafType | null>(null);
  const [formName, setFormName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setFormName("");
    setEditingItem(null);
    setError(null);
    setModalMode("create");
  }

  function openEdit(lt: DbLoafType) {
    setFormName(lt.loaf_name);
    setEditingItem(lt);
    setError(null);
    setModalMode("edit");
  }

  async function handleSave() {
    if (!formName.trim()) return;
    setSaving(true);
    setError(null);

    if (modalMode === "create") {
      const { data, error } = await supabase
        .from("loaf_types")
        .insert({ loaf_name: formName.trim() })
        .select()
        .single();
      if (error) { setError(error.message); setSaving(false); return; }
      setLoafTypes((prev) => [...prev, data]);
      onAdd?.(data);
    } else if (modalMode === "edit" && editingItem) {
      const { error } = await supabase
        .from("loaf_types")
        .update({ loaf_name: formName.trim() })
        .eq("id", editingItem.id);
      if (error) { setError(error.message); setSaving(false); return; }
      const updated = { ...editingItem, loaf_name: formName.trim() };
      setLoafTypes((prev) =>
        prev.map((lt) => (lt.id === editingItem.id ? updated : lt))
      );
      onUpdate?.(updated);
    }

    setSaving(false);
    setModalMode(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from("loaf_types")
      .delete()
      .eq("id", deleteTarget.id);
    if (!error) {
      setLoafTypes((prev) => prev.filter((lt) => lt.id !== deleteTarget.id));
      onDeleteProp?.(deleteTarget.id);
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-stone-700">Loaf Types</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-3.5" />
          New
        </Button>
      </div>

      {loafTypes.length === 0 && (
        <p className="text-sm text-stone-400 py-2">No loaf types yet.</p>
      )}
      {loafTypes.map((lt) => (
        <AdminItemRow
          key={lt.id}
          label={lt.loaf_name}
          onEdit={() => openEdit(lt)}
          onDelete={() => setDeleteTarget(lt)}
        />
      ))}

      <AdminModal
        open={modalMode !== null}
        onOpenChange={(open) => !open && setModalMode(null)}
        title={modalMode === "create" ? "Add Loaf Type" : "Edit Loaf Type"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Loaf Type Name
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Rustic Loaf"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={() => setModalMode(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !formName.trim()}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </AdminModal>

      <DeleteConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.loaf_name ?? ""}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
