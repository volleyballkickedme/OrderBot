"use client";

import { useState } from "react";
import { Pencil, Minus, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminModal } from "./AdminModal";
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

function groupByFlavour(items: DbMenuItemWithJoins[]) {
  const groups: { flavour: string; items: DbMenuItemWithJoins[] }[] = [];
  for (const item of items) {
    const group = groups.find((g) => g.flavour === item.flavour);
    if (group) {
      group.items.push(item);
    } else {
      groups.push({ flavour: item.flavour, items: [item] });
    }
  }
  return groups;
}

export function MenuItemsSection({
  initialMenuItems,
  categories,
  loafTypes,
}: MenuItemsSectionProps) {
  const supabase = createClient();
  const [menuItems, setMenuItems] = useState<DbMenuItemWithJoins[]>(initialMenuItems);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm(categories, loafTypes));
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Creation modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm(categories, loafTypes));
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<DbMenuItemWithJoins | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openEdit(item: DbMenuItemWithJoins) {
    setEditingId(item.id);
    setEditForm({
      category_id: item.category_id,
      loaf_type_id: item.loaf_type_id,
      flavour: item.flavour,
      price: String(item.price),
    });
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError(null);
  }

  async function handleSave() {
    if (!editingId) return;
    const { flavour, price, category_id, loaf_type_id } = editForm;
    if (!flavour.trim() || !price || !category_id || !loaf_type_id) return;
    setSaving(true);
    setEditError(null);

    const payload = {
      category_id,
      loaf_type_id,
      flavour: flavour.trim(),
      price: parseFloat(price),
    };

    const { data, error } = await supabase
      .from("menu_items")
      .update(payload)
      .eq("id", editingId)
      .select("*, loaf_types(loaf_name), item_categories(category_name)")
      .single();

    if (error) {
      setEditError(error.message);
      setSaving(false);
      return;
    }

    setMenuItems((prev) => prev.map((m) => (m.id === editingId ? data : m)));
    setSaving(false);
    setEditingId(null);
  }

  function openCreate() {
    setCreateForm(emptyForm(categories, loafTypes));
    setCreateError(null);
    setCreateModalOpen(true);
  }

  async function handleCreate() {
    const { flavour, price, category_id, loaf_type_id } = createForm;
    if (!flavour.trim() || !price || !category_id || !loaf_type_id) return;
    setCreating(true);
    setCreateError(null);

    const { data, error } = await supabase
      .from("menu_items")
      .insert({ category_id, loaf_type_id, flavour: flavour.trim(), price: parseFloat(price) })
      .select("*, loaf_types(loaf_name), item_categories(category_name)")
      .single();

    if (error) {
      setCreateError(error.message);
      setCreating(false);
      return;
    }

    setMenuItems((prev) => [...prev, data]);
    setCreating(false);
    setCreateModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("menu_items").delete().eq("id", deleteTarget.id);
    if (!error) {
      setMenuItems((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  const isEditFormValid =
    editForm.flavour.trim() !== "" &&
    editForm.price !== "" &&
    !isNaN(parseFloat(editForm.price)) &&
    editForm.category_id !== "" &&
    editForm.loaf_type_id !== "";

  const isCreateFormValid =
    createForm.flavour.trim() !== "" &&
    createForm.price !== "" &&
    !isNaN(parseFloat(createForm.price)) &&
    createForm.category_id !== "" &&
    createForm.loaf_type_id !== "";

  const groups = groupByFlavour(menuItems);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-stone-700">Menu Items</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-3.5" />
          New
        </Button>
      </div>

      {groups.length === 0 && (
        <p className="text-sm text-stone-400 py-2">No menu items yet.</p>
      )}

      {groups.map((group) => {
        const lowestPrice = Math.min(...group.items.map((i) => i.price));
        return (
          <div key={group.flavour} className="mb-5 last:mb-0">
            <h3 className="font-bold text-lg text-stone-700 mb-2">
              {group.flavour}{" "}
              <span className="text-amber-700 font-normal">${lowestPrice.toFixed(2)}</span>
            </h3>
            <div>
              {group.items.map((item) =>
                editingId === item.id ? (
                  <div
                    key={item.id}
                    className="py-3 border-b border-amber-100 last:border-0 space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Flavour</label>
                        <input
                          type="text"
                          value={editForm.flavour}
                          onChange={(e) => setEditForm((f) => ({ ...f, flavour: e.target.value }))}
                          className={inputClass}
                          placeholder="e.g. Plain"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                          className={inputClass}
                          placeholder="e.g. 14.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Loaf Type</label>
                        <select
                          value={editForm.loaf_type_id}
                          onChange={(e) => setEditForm((f) => ({ ...f, loaf_type_id: e.target.value }))}
                          className={selectClass}
                        >
                          {loafTypes.map((lt) => (
                            <option key={lt.id} value={lt.id}>{lt.loaf_name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1">Category</label>
                        <select
                          value={editForm.category_id}
                          onChange={(e) => setEditForm((f) => ({ ...f, category_id: e.target.value }))}
                          className={selectClass}
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.category_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {editError && <p className="text-sm text-red-600">{editError}</p>}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={cancelEdit} disabled={saving}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving || !isEditFormValid}>
                        {saving ? "Saving…" : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
                  >
                    <span className="text-stone-600 text-sm flex-1">
                      {item.loaf_types?.loaf_name}
                      {item.item_categories?.category_name
                        ? ` · ${item.item_categories.category_name}`
                        : ""}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(item)}
                        aria-label="Edit"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(item)}
                        aria-label="Delete"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Minus />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}

      <AdminModal
        open={createModalOpen}
        onOpenChange={(open) => !open && setCreateModalOpen(false)}
        title="Add Menu Item"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Category</label>
            <select
              value={createForm.category_id}
              onChange={(e) => setCreateForm((f) => ({ ...f, category_id: e.target.value }))}
              className={selectClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.category_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Loaf Type</label>
            <select
              value={createForm.loaf_type_id}
              onChange={(e) => setCreateForm((f) => ({ ...f, loaf_type_id: e.target.value }))}
              className={selectClass}
            >
              {loafTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>{lt.loaf_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Flavour</label>
            <input
              type="text"
              value={createForm.flavour}
              onChange={(e) => setCreateForm((f) => ({ ...f, flavour: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Plain"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Price ($)</label>
            <input
              type="number"
              value={createForm.price}
              onChange={(e) => setCreateForm((f) => ({ ...f, price: e.target.value }))}
              className={inputClass}
              placeholder="e.g. 14.00"
              min="0"
              step="0.01"
            />
          </div>
          {createError && <p className="text-sm text-red-600">{createError}</p>}
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating || !isCreateFormValid}>
              {creating ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </AdminModal>

      <DeleteConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={
          deleteTarget
            ? `${deleteTarget.flavour} · ${deleteTarget.loaf_types?.loaf_name ?? ""}`
            : ""
        }
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
