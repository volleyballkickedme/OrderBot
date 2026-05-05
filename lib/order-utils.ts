import { LOAF_TYPES, FLAVOURS, type CartItem } from "@/lib/config";

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
  for (const loaf of LOAF_TYPES) {
    for (const flavour of FLAVOURS) {
      const qty = quantities[cartKey(loaf.id, flavour)] ?? 0;
      if (qty > 0) {
        items.push({
          loafId: loaf.id,
          loafLabel: loaf.label,
          flavour,
          qty,
          unitPrice: loaf.price,
        });
      }
    }
  }
  return items;
}
