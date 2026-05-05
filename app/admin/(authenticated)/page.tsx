import { createClient } from "@/utils/supabase/server";
import { AdminPageClient } from "@/components/admin/AdminPageClient";
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
    <AdminPageClient
      initialCategories={(categories as DbCategory[]) ?? []}
      initialLoafTypes={(loafTypes as DbLoafType[]) ?? []}
      initialMenuItems={(menuItems as DbMenuItemWithJoins[]) ?? []}
    />
  );
}
