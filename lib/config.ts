export const DELIVERY_OPTIONS = [
  { id: "pickup", label: "Self-Pickup", surcharge: 0 },
  { id: "standard", label: "Standard Delivery from 3pm to 9pm (Excluding Sentosa and Tuas)", surcharge: 15 },
] as const;

export type CategoryId = string;
export type LoafId = string;
export type Flavour = string;
export type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

export interface CartItem {
  loafId: LoafId;
  loafLabel: string;
  flavour: Flavour;
  qty: number;
  unitPrice: number;
}
