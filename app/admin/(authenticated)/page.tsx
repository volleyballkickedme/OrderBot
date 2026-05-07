import { createClient } from "@/utils/supabase/server";
import { AdminPageClient } from "@/components/admin/AdminPageClient";
import type { DbCategory, DbVariant, DbMenuItemWithJoins } from "@/utils/supabase/types";

export default async function AdminPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: variants }, { data: menuItems }] =
    await Promise.all([
      supabase.from("item_categories").select("*"),
      supabase.from("menu_item_variants").select("*"),
      supabase
        .from("menu_items")
        .select("*, menu_item_variants(variant_name), item_categories(category_name)"),
    ]);

  return (
    <AdminPageClient
      initialCategories={(categories as DbCategory[]) ?? []}
      initialVariants={(variants as DbVariant[]) ?? []}
      initialMenuItems={(menuItems as DbMenuItemWithJoins[]) ?? []}
    />
  );
}
