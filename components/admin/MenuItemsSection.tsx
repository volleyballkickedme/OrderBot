"use client";

import { useState } from "react";
import { Pencil, Minus, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminModal } from "./AdminModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import type { DbVariant, DbMenuItemWithJoins } from "@/utils/supabase/types";

const inputClass =
  "w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm";

const selectClass =
  "w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm appearance-none";

interface MenuItemsSectionProps {
  categoryId: string;
  menuItems: DbMenuItemWithJoins[];
  variants: DbVariant[];
  onAdd: (item: DbMenuItemWithJoins) => void;
  onUpdate: (item: DbMenuItemWithJoins) => void;
  onDelete: (id: string) => void;
}

interface FormState {
  item_variant_id: string;
  flavour: string;
  price: string;
}

function emptyForm(variants: DbVariant[]): FormState {
  return { item_variant_id: variants[0]?.id ?? "", flavour: "", price: "" };
}

function groupByFlavour(items: DbMenuItemWithJoins[]) {
  const groups: { flavour: string; items: DbMenuItemWithJoins[] }[] = [];
  for (const item of items) {
    const group = groups.find((g) => g.flavour === item.flavour);
    if (group) group.items.push(item);
    else groups.push({ flavour: item.flavour, items: [item] });
  }
  return groups;
}

export function MenuItemsSection({ categoryId, menuItems, variants, onAdd, onUpdate, onDelete }: MenuItemsSectionProps) {
  const supabase = createClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm(variants));
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm(variants));
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DbMenuItemWithJoins | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openEdit(item: DbMenuItemWithJoins) {
    setEditingId(item.id);
    setEditForm({ item_variant_id: item.item_variant_id, flavour: item.flavour, price: String(item.price) });
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError(null);
  }

  async function handleSave() {
    if (!editingId) return;
    const { flavour, price, item_variant_id } = editForm;
    if (!flavour.trim() || !price || !item_variant_id) return;
    setSaving(true);
    setEditError(null);

    const { data, error } = await supabase
      .from("menu_items")
      .update({ category_id: categoryId, item_variant_id, flavour: flavour.trim(), price: parseFloat(price) })
      .eq("id", editingId)
      .select("*, menu_item_variants(variant_name), item_categories(category_name)")
      .single();

    if (error) { setEditError(error.message); setSaving(false); return; }
    onUpdate(data);
    setSaving(false);
    setEditingId(null);
  }

  function openCreate() {
    setCreateForm(emptyForm(variants));
    setCreateError(null);
    setCreateModalOpen(true);
  }

  async function handleCreate() {
    const { flavour, price, item_variant_id } = createForm;
    if (!flavour.trim() || !price || !item_variant_id) return;
    setCreating(true);
    setCreateError(null);

    const { data, error } = await supabase
      .from("menu_items")
      .insert({ category_id: categoryId, item_variant_id, flavour: flavour.trim(), price: parseFloat(price) })
      .select("*, menu_item_variants(variant_name), item_categories(category_name)")
      .single();

    if (error) { setCreateError(error.message); setCreating(false); return; }
    onAdd(data);
    setCreating(false);
    setCreateModalOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("menu_items").delete().eq("id", deleteTarget.id);
    if (!error) onDelete(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  }

  const isEditFormValid =
    editForm.flavour.trim() !== "" &&
    editForm.price !== "" &&
    !isNaN(parseFloat(editForm.price)) &&
    editForm.item_variant_id !== "";

  const isCreateFormValid =
    createForm.flavour.trim() !== "" &&
    createForm.price !== "" &&
    !isNaN(parseFloat(createForm.price)) &&
    createForm.item_variant_id !== "";

  const groups = groupByFlavour(menuItems);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-stone-500 uppercase tracking-wide">Menu Items</h3>
        <Button size="sm" onClick={openCreate} disabled={variants.length === 0}>
          <Plus className="size-3.5" />
          Add
        </Button>
      </div>

      {variants.length === 0 && (
        <p className="text-sm text-stone-400 py-2">Add a variant first before creating menu items.</p>
      )}

      {variants.length > 0 && groups.length === 0 && (
        <p className="text-sm text-stone-400 py-2">No menu items yet.</p>
      )}

      {groups.map((group) => {
        const lowestPrice = Math.min(...group.items.map((i) => i.price));
        return (
          <div key={group.flavour} className="mb-4 last:mb-0">
            <h4 className="font-semibold text-stone-700 mb-1">
              {group.flavour}{" "}
              <span className="text-amber-700 font-normal text-sm">${lowestPrice.toFixed(2)}</span>
            </h4>
            <div>
              {group.items.map((item) =>
                editingId === item.id ? (
                  <div key={item.id} className="py-3 border-b border-amber-100 last:border-0 space-y-2">
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
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">Variant</label>
                      <select
                        value={editForm.item_variant_id}
                        onChange={(e) => setEditForm((f) => ({ ...f, item_variant_id: e.target.value }))}
                        className={selectClass}
                      >
                        {variants.map((v) => (
                          <option key={v.id} value={v.id}>{v.variant_name}</option>
                        ))}
                      </select>
                    </div>
                    {editError && <p className="text-sm text-red-600">{editError}</p>}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={cancelEdit} disabled={saving}>Cancel</Button>
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
                      {item.menu_item_variants?.variant_name ?? "—"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)} aria-label="Edit">
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
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Variant</label>
            <select
              value={createForm.item_variant_id}
              onChange={(e) => setCreateForm((f) => ({ ...f, item_variant_id: e.target.value }))}
              className={selectClass}
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>{v.variant_name}</option>
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
            <Button variant="outline" onClick={() => setCreateModalOpen(false)} disabled={creating}>Cancel</Button>
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
            ? `${deleteTarget.flavour} · ${deleteTarget.menu_item_variants?.variant_name ?? ""}`
            : ""
        }
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
