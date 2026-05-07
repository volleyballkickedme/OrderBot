"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminModal } from "./AdminModal";
import { AdminItemRow } from "./AdminItemRow";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import type { DbVariant } from "@/utils/supabase/types";

const inputClass =
  "w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm";

interface VariantsSectionProps {
  categoryId: string;
  variants: DbVariant[];
  onAdd: (item: DbVariant) => void;
  onUpdate: (item: DbVariant) => void;
  onDelete: (id: string) => void;
}

export function LoafTypesSection({ categoryId, variants, onAdd, onUpdate, onDelete }: VariantsSectionProps) {
  const supabase = createClient();
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<DbVariant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DbVariant | null>(null);
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

  function openEdit(v: DbVariant) {
    setFormName(v.variant_name);
    setEditingItem(v);
    setError(null);
    setModalMode("edit");
  }

  async function handleSave() {
    if (!formName.trim()) return;
    setSaving(true);
    setError(null);

    if (modalMode === "create") {
      const { data, error } = await supabase
        .from("menu_item_variants")
        .insert({ variant_name: formName.trim(), item_category_id: categoryId })
        .select()
        .single();
      if (error) { setError(error.message); setSaving(false); return; }
      onAdd(data);
    } else if (modalMode === "edit" && editingItem) {
      const { error } = await supabase
        .from("menu_item_variants")
        .update({ variant_name: formName.trim() })
        .eq("id", editingItem.id);
      if (error) { setError(error.message); setSaving(false); return; }
      onUpdate({ ...editingItem, variant_name: formName.trim() });
    }

    setSaving(false);
    setModalMode(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from("menu_item_variants")
      .delete()
      .eq("id", deleteTarget.id);
    if (!error) onDelete(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-stone-500 uppercase tracking-wide">Variants</h3>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>

      {variants.length === 0 && (
        <p className="text-sm text-stone-400 py-2">No variants yet.</p>
      )}
      {variants.map((v) => (
        <AdminItemRow
          key={v.id}
          label={v.variant_name}
          onEdit={() => openEdit(v)}
          onDelete={() => setDeleteTarget(v)}
        />
      ))}

      <AdminModal
        open={modalMode !== null}
        onOpenChange={(open) => !open && setModalMode(null)}
        title={modalMode === "create" ? "Add Variant" : "Edit Variant"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Variant Name
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
        itemName={deleteTarget?.variant_name ?? ""}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
