import type { CartItem } from "@/lib/config";
import type { CategoryGroup } from "@/utils/supabase/types";

export type QuantityMap = Record<string, number>;

export function cartKey(menuItemId: string, loafName: string) {
  return `${menuItemId}::${loafName}`;
}

export function isValidSgPhone(val: string) {
  return /^(\+65)?[689]\d{7}$/.test(val.trim().replace(/\s/g, ""));
}

export function isAllowedDay(dateStr: string) {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 1 || day === 6;
}

export function buildCartItems(
  quantities: QuantityMap,
  categoryGroups: CategoryGroup[]
): CartItem[] {
  const items: CartItem[] = [];
  for (const group of categoryGroups) {
    for (const flavourGroup of group.flavourGroups) {
      for (const option of flavourGroup.loafOptions) {
        const key = cartKey(option.menuItemId, option.loafName);
        const qty = quantities[key] ?? 0;
        if (qty > 0) {
          items.push({
            loafId: option.menuItemId,
            loafLabel: flavourGroup.flavour,
            flavour: option.loafName,
            qty,
            unitPrice: option.price,
          });
        }
      }
    }
  }
  return items;
}

export function buildCategoryGroups(
  rawMenuItems: Array<{
    id: string;
    flavour: string;
    price: number;
    category_id: string;
    loaf_type_id: string;
    loaf_types: { loaf_name: string } | null;
    item_categories: { category_name: string } | null;
  }>
): CategoryGroup[] {
  const categoryMap = new Map<
    string,
    { label: string; flavourMap: Map<string, { menuItemId: string; loafName: string; price: number }[]> }
  >();

  for (const item of rawMenuItems) {
    const catId = item.category_id;
    const catLabel = item.item_categories?.category_name ?? catId;
    const loafName = item.loaf_types?.loaf_name ?? item.loaf_type_id;

    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, { label: catLabel, flavourMap: new Map() });
    }
    const cat = categoryMap.get(catId)!;

    if (!cat.flavourMap.has(item.flavour)) {
      cat.flavourMap.set(item.flavour, []);
    }
    cat.flavourMap.get(item.flavour)!.push({
      menuItemId: item.id,
      loafName,
      price: Number(item.price),
    });
  }

  return Array.from(categoryMap.entries()).map(([id, { label, flavourMap }]) => ({
    id,
    label,
    flavourGroups: Array.from(flavourMap.entries()).map(([flavour, loafOptions]) => ({
      flavour,
      loafOptions,
    })),
  }));
}
