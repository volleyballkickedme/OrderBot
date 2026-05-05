"use client";

import { useState } from "react";
import { CategoriesSection } from "./CategoriesSection";
import { LoafTypesSection } from "./LoafTypesSection";
import { MenuItemsSection } from "./MenuItemsSection";
import type { DbCategory, DbLoafType, DbMenuItemWithJoins } from "@/utils/supabase/types";

interface AdminPageClientProps {
  initialCategories: DbCategory[];
  initialLoafTypes: DbLoafType[];
  initialMenuItems: DbMenuItemWithJoins[];
}

export function AdminPageClient({
  initialCategories,
  initialLoafTypes,
  initialMenuItems,
}: AdminPageClientProps) {
  const [categories, setCategories] = useState<DbCategory[]>(initialCategories);
  const [loafTypes, setLoafTypes] = useState<DbLoafType[]>(initialLoafTypes);

  return (
    <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <CategoriesSection
        initialCategories={initialCategories}
        onAdd={(item) => setCategories((prev) => [...prev, item])}
        onUpdate={(item) => setCategories((prev) => prev.map((c) => (c.id === item.id ? item : c)))}
        onDelete={(id) => setCategories((prev) => prev.filter((c) => c.id !== id))}
      />
      <LoafTypesSection
        initialLoafTypes={initialLoafTypes}
        onAdd={(item) => setLoafTypes((prev) => [...prev, item])}
        onUpdate={(item) => setLoafTypes((prev) => prev.map((lt) => (lt.id === item.id ? item : lt)))}
        onDelete={(id) => setLoafTypes((prev) => prev.filter((lt) => lt.id !== id))}
      />
      <MenuItemsSection
        initialMenuItems={initialMenuItems}
        categories={categories}
        loafTypes={loafTypes}
      />
    </main>
  );
}
