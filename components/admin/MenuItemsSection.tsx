"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminModal } from "./AdminModal";
import { AdminItemRow } from "./AdminItemRow";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import type { DbCategory, DbLoafType, DbMenuItemWithJoins } from "@/utils/supabase/types";

const inputClass =
  "w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm";

const selectClass =
  "w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm appearance-none";

interface MenuItemsSectionProps {
  initialMenuItems: DbMenuItemWithJoins[];
  categories: DbCategory[];
  loafTypes: DbLoafType[];
}

interface FormState {
  category_id: string;
  loaf_type_id: string;
  flavour: string;
  price: string;
}

const emptyForm = (categories: DbCategory[], loafTypes: DbLoafType[]): FormState => ({
  category_id: categories[0]?.id ?? "",
  loaf_type_id: loafTypes[0]?.id ?? "",
  flavour: "",
  price: "",
});

export function MenuItemsSection({
  initialMenuItems,
  categories,
  loafTypes,
}: MenuItemsSectionProps) {
  const supabase = createClient();
  const [menuItems, setMenuItems] = useState<DbMenuItemWithJoins[]>(initialMenuItems);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<DbMenuItemWithJoins | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DbMenuItemWithJoins | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(categories, loafTypes));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setForm(emptyForm(categories, loafTypes));
    setEditingItem(null);
    setError(null);
    setModalMode("create");
  }

  function openEdit(item: DbMenuItemWithJoins) {
    setForm({
      category_id: item.category_id,
      loaf_type_id: item.loaf_type_id,
      flavour: item.flavour,
      price: String(item.price),
    });
    setEditingItem(item);
    setError(null);
    setModalMode("edit");
  }

  function itemLabel(item: DbMenuItemWithJoins) {
    const loafName = item.loaf_types?.loaf_name ?? item.loaf_type_id;
    const catName = item.item_categories?.category_name ?? "";
    return `${item.flavour} · ${loafName} · $${Number(item.price).toFixed(2)}${catName ? ` · ${catName}` : ""}`;
  }

  async function handleSave() {
    if (!form.flavour.trim() || !form.price || !form.category_id || !form.loaf_type_id) return;
    setSaving(true);
    setError(null);

    const payload = {
      category_id: form.category_id,
      loaf_type_id: form.loaf_type_id,
      flavour: form.flavour.trim(),
      price: parseFloat(form.price),
    };

    if (modalMode === "create") {
      const { data, error } = await supabase
        .from("menu_items")
        .insert(payload)
        .select("*, loaf_types(loaf_name), item_categories(category_name)")
        .single();
      if (error) { setError(error.message); setSaving(false); return; }
      setMenuItems((prev) => [...prev, data]);
    } else if (modalMode === "edit" && editingItem) {
      const { data, error } = await supabase
        .from("menu_items")
        .update(payload)
        .eq("id", editingItem.id)
        .select("*, loaf_types(loaf_name), item_categories(category_name)")
        .single();
      if (error) { setError(error.message); setSaving(false); return; }
      setMenuItems((prev) =>
        prev.map((m) => (m.id === editingItem.id ? data : m))
      );
    }

    setSaving(false);
    setModalMode(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", deleteTarget.id);
    if (!error) {
      setMenuItems((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  const isFormValid =
    form.flavour.trim() !== "" &&
    form.price !== "" &&
    !isNaN(parseFloat(form.price)) &&
    form.category_id !== "" &&
    form.loaf_type_id !== "";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-stone-700">Menu Items</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-3.5" />
          New
        </Button>
      </div>

      {menuItems.length === 0 && (
        <p className="text-sm text-stone-400 py-2">No menu items yet.</p>
      )}
      {menuItems.map((item) => (
        <AdminItemRow
          key={item.id}
          label={itemLabel(item)}
          onEdit={() => openEdit(item)}
          onDelete={() => setDeleteTarget(item)}
        />
      ))}

      <AdminModal
        open={modalMode !== null}
        onOpenChange={(open) => !open && setModalMode(null)}
        title={modalMode === "create" ? "Add Menu Item" : "Edit Menu Item"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Category
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className={selectClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Loaf Type
            </label>
            <select
              value={form.loaf_type_id}
              onChange={(e) => setForm((f) => ({ ...f, loaf_type_id: e.target.value }))}
              className={selectClass}
            >
              {loafTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.loaf_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Flavour (bread variant)
            </label>
            <input
              type="text"
              value={form.flavour}
              onChange={(e) => setForm((f) => ({ ...f, flavour: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Plain"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Price ($)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className={inputClass}
              placeholder="e.g. 14.00"
              min="0"
              step="0.01"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={() => setModalMode(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !isFormValid}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </AdminModal>

      <DeleteConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget ? itemLabel(deleteTarget) : ""}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
