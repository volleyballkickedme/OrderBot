import { createClient } from "@/utils/supabase/server";
import { CategoriesSection } from "@/components/admin/CategoriesSection";
import { LoafTypesSection } from "@/components/admin/LoafTypesSection";
import { MenuItemsSection } from "@/components/admin/MenuItemsSection";
import type { DbCategory, DbLoafType, DbMenuItemWithJoins } from "@/utils/supabase/types";

export default async function AdminPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: loafTypes }, { data: menuItems }] =
    await Promise.all([
      supabase.from("item_categories").select("*"),
      supabase.from("loaf_types").select("*"),
      supabase
        .from("menu_items")
        .select("*, loaf_types(loaf_name), item_categories(category_name)"),
    ]);

  return (
    <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <CategoriesSection initialCategories={(categories as DbCategory[]) ?? []} />
      <LoafTypesSection initialLoafTypes={(loafTypes as DbLoafType[]) ?? []} />
      <MenuItemsSection
        initialMenuItems={(menuItems as DbMenuItemWithJoins[]) ?? []}
        categories={(categories as DbCategory[]) ?? []}
        loafTypes={(loafTypes as DbLoafType[]) ?? []}
      />
    </main>
  );
}
