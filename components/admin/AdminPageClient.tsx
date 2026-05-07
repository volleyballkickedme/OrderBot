"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { LoafTypesSection } from "./LoafTypesSection";
import { MenuItemsSection } from "./MenuItemsSection";
import { AdminModal } from "./AdminModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import type { DbCategory, DbVariant, DbMenuItemWithJoins } from "@/utils/supabase/types";

const inputClass =
  "w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm";

interface AdminPageClientProps {
  initialCategories: DbCategory[];
  initialVariants: DbVariant[];
  initialMenuItems: DbMenuItemWithJoins[];
}

export function AdminPageClient({ initialCategories, initialVariants, initialMenuItems }: AdminPageClientProps) {
  const supabase = createClient();

  const [categories, setCategories] = useState<DbCategory[]>(initialCategories);
  const [variants, setVariants] = useState<DbVariant[]>(initialVariants);
  const [menuItems, setMenuItems] = useState<DbMenuItemWithJoins[]>(initialMenuItems);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategories[0]?.id ?? "");

  // Category modal state
  const [catModalMode, setCatModalMode] = useState<"create" | "edit" | null>(null);
  const [editingCat, setEditingCat] = useState<DbCategory | null>(null);
  const [catFormName, setCatFormName] = useState("");
  const [catSaving, setCatSaving] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Category delete state
  const [deleteCatTarget, setDeleteCatTarget] = useState<DbCategory | null>(null);
  const [deletingCat, setDeletingCat] = useState(false);

  function openCreateCat() {
    setCatFormName("");
    setEditingCat(null);
    setCatError(null);
    setCatModalMode("create");
  }

  function openEditCat(cat: DbCategory) {
    setCatFormName(cat.category_name);
    setEditingCat(cat);
    setCatError(null);
    setCatModalMode("edit");
  }

  async function handleSaveCat() {
    if (!catFormName.trim()) return;
    setCatSaving(true);
    setCatError(null);

    if (catModalMode === "create") {
      const { data, error } = await supabase
        .from("item_categories")
        .insert({ category_name: catFormName.trim() })
        .select()
        .single();
      if (error) { setCatError(error.message); setCatSaving(false); return; }
      setCategories((prev) => [...prev, data]);
      setActiveCategory(data.id);
    } else if (catModalMode === "edit" && editingCat) {
      const { error } = await supabase
        .from("item_categories")
        .update({ category_name: catFormName.trim() })
        .eq("id", editingCat.id);
      if (error) { setCatError(error.message); setCatSaving(false); return; }
      setCategories((prev) => prev.map((c) => (c.id === editingCat.id ? { ...c, category_name: catFormName.trim() } : c)));
    }

    setCatSaving(false);
    setCatModalMode(null);
  }

  async function handleDeleteCat() {
    if (!deleteCatTarget) return;
    setDeletingCat(true);
    const { error } = await supabase.from("item_categories").delete().eq("id", deleteCatTarget.id);
    if (!error) {
      const remaining = categories.filter((c) => c.id !== deleteCatTarget.id);
      setCategories(remaining);
      setVariants((prev) => prev.filter((v) => v.item_category_id !== deleteCatTarget.id));
      setMenuItems((prev) => prev.filter((m) => m.category_id !== deleteCatTarget.id));
      if (activeCategory === deleteCatTarget.id) setActiveCategory(remaining[0]?.id ?? "");
    }
    setDeletingCat(false);
    setDeleteCatTarget(null);
  }

  const activeVariants = variants.filter((v) => v.item_category_id === activeCategory);
  const activeMenuItems = menuItems.filter((m) => m.category_id === activeCategory);

  return (
    <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
      {/* Category tab bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <div key={cat.id} className="relative group flex items-center">
              <button
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat.category_name}
              </button>
              {activeCategory === cat.id && (
                <div className="flex items-center ml-1 gap-0.5">
                  <button
                    onClick={() => openEditCat(cat)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                    aria-label="Edit category"
                  >
                    <Pencil className="size-3" />
                  </button>
                  <button
                    onClick={() => setDeleteCatTarget(cat)}
                    className="p-1 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete category"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={openCreateCat}>
            <Plus className="size-3.5" />
            New
          </Button>
        </div>
      </div>

      {/* Per-category content */}
      {activeCategory && (
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-6">
          <LoafTypesSection
            categoryId={activeCategory}
            variants={activeVariants}
            onAdd={(v) => setVariants((prev) => [...prev, v])}
            onUpdate={(v) => setVariants((prev) => prev.map((x) => (x.id === v.id ? v : x)))}
            onDelete={(id) => setVariants((prev) => prev.filter((x) => x.id !== id))}
          />
          <div className="border-t border-stone-100" />
          <MenuItemsSection
            categoryId={activeCategory}
            menuItems={activeMenuItems}
            variants={activeVariants}
            onAdd={(item) => setMenuItems((prev) => [...prev, item])}
            onUpdate={(item) => setMenuItems((prev) => prev.map((x) => (x.id === item.id ? item : x)))}
            onDelete={(id) => setMenuItems((prev) => prev.filter((x) => x.id !== id))}
          />
        </div>
      )}

      {categories.length === 0 && (
        <p className="text-center text-sm text-stone-400 py-4">No categories yet. Create one to get started.</p>
      )}

      {/* Category modals */}
      <AdminModal
        open={catModalMode !== null}
        onOpenChange={(open) => !open && setCatModalMode(null)}
        title={catModalMode === "create" ? "Add Category" : "Edit Category"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Category Name</label>
            <input
              type="text"
              value={catFormName}
              onChange={(e) => setCatFormName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Sourdough"
            />
          </div>
          {catError && <p className="text-sm text-red-600">{catError}</p>}
          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={() => setCatModalMode(null)} disabled={catSaving}>Cancel</Button>
            <Button onClick={handleSaveCat} disabled={catSaving || !catFormName.trim()}>
              {catSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </AdminModal>

      <DeleteConfirmModal
        open={deleteCatTarget !== null}
        onOpenChange={(open) => !open && setDeleteCatTarget(null)}
        itemName={deleteCatTarget?.category_name ?? ""}
        onConfirm={handleDeleteCat}
        loading={deletingCat}
      />
    </main>
  );
}
