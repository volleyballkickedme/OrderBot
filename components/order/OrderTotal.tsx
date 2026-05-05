import { type CartItem } from "@/lib/config";

interface OrderTotalProps {
  cartItems: CartItem[];
  total: number;
  deliveryOption: { label: string; surcharge: number };
}

export function OrderTotal({ cartItems, total, deliveryOption }: OrderTotalProps) {
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="bg-amber-700 text-white rounded-2xl px-5 py-4 flex justify-between items-center shadow-sm">
      <div>
        <p className="text-amber-200 text-sm">
          {cartItems.length === 0
            ? "Add items to see total"
            : `${itemCount} item${itemCount !== 1 ? "s" : ""} · ${deliveryOption.label}`}
        </p>
        <p className="font-bold text-xl">${total.toFixed(2)}</p>
      </div>
      <span className="text-3xl">🧾</span>
    </div>
  );
}
