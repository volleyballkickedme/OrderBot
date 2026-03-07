export const LOAF_TYPES = [
  { id: "rustic", label: "Rustic Loaf", price: 10 },
  { id: "sandwich", label: "Sandwich Loaf", price: 10 },
] as const;

export const FLAVOURS = [
  "Plain",
  "Cranberry & Walnut",
  "Cranberry",
  "Walnut",
  "Red Yeast with Goji Berries",
  "Cinnamon Chocolate",
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
