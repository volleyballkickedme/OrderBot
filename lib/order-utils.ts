import { PRODUCT_CATEGORIES, type CartItem } from "@/lib/config";

export type QuantityMap = Record<string, number>;

export function cartKey(loafId: string, flavour: string) {
  return `${loafId}::${flavour}`;
}

export function isValidSgPhone(val: string) {
  return /^(\+65)?[689]\d{7}$/.test(val.trim().replace(/\s/g, ""));
}

export function isAllowedDay(dateStr: string) {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 1 || day === 6;
}

export function buildCartItems(quantities: QuantityMap): CartItem[] {
  const items: CartItem[] = [];
  for (const category of PRODUCT_CATEGORIES) {
    for (const item of category.items) {
      for (const flavour of category.flavours) {
        const qty = quantities[cartKey(item.id, flavour)] ?? 0;
        if (qty > 0) {
          items.push({
            loafId: item.id,
            loafLabel: item.label,
            flavour,
            qty,
            unitPrice: item.price,
          });
        }
      }
    }
  }
  return items;
}
