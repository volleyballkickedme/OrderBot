import { createClient } from "@/utils/supabase/server";
import { OrderForm } from "@/components/order/OrderForm";
import { buildCategoryGroups } from "@/lib/order-utils";

export default async function OrderPage() {
  const supabase = await createClient();

  const { data: rawMenuItems } = await supabase
    .from("menu_items")
    .select("*, loaf_types(loaf_name), item_categories(category_name)");

  const categoryGroups = buildCategoryGroups(rawMenuItems ?? []);

  return <OrderForm categoryGroups={categoryGroups} />;
}
