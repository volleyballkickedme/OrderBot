export const LOAF_TYPES = [
  { id: "plain", label: "Plain", price: 10 },
  { id: "cranberrywalnut", label: "Cranberry & Walnut", price: 14 },
  { id: "redyeastcranberry", label: "Red Yeast & Cranberry", price: 14 },
  { id: "cinnamonchocolate", label: "Cinnamon Chocolate", price: 14 },
  { id: "apricotraisin", label: "Apricot & Raisin", price: 14 },
  { id: "walnutapricot", label: "Walnut & Apricot", price: 14 },
  // { id: "matcharaisinalmond", label: "Matcha Raisin & Almond", price: 14 },
  { id: "olivewalnut", label: "Olive & Walnut", price: 14 },
  { id: "olive", label: "Olive", price: 14 },
  { id: "cranberry", label: "Cranberry", price: 14 },
  { id: "walnut", label: "Walnut", price: 14 },
] as const;

export const FLAVOURS = [
  "Rustic Loaf",
  "Sandwich Loaf",
] as const;

export const DELIVERY_OPTIONS = [
  { id: "pickup", label: "Self-Pickup", surcharge: 0 },
  { id: "standard", label: "Standard Delivery from 3pm to 9pm (Excluding Sentosa and Tuas)", surcharge: 15 },
] as const;

export type LoafId = (typeof LOAF_TYPES)[number]["id"];
export type Flavour = (typeof FLAVOURS)[number];
export type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

export interface CartItem {
  loafId: LoafId;
  loafLabel: string;
  flavour: Flavour;
  qty: number;
  unitPrice: number;
}
