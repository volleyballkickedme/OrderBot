"use client";

import { useState } from "react";
import { PRODUCT_CATEGORIES, type CategoryId, type CartItem } from "@/lib/config";
import { cartKey, type QuantityMap } from "@/lib/order-utils";
import { FlavourRow } from "./FlavourRow";
import { cn } from "@/lib/utils";

interface ProductSelectorProps {
  quantities: QuantityMap;
  onChangeQty: (loafId: string, flavour: string, delta: number) => void;
  cartItems: CartItem[];
}

export function ProductSelector({ quantities, onChangeQty, cartItems }: ProductSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>(PRODUCT_CATEGORIES[0].id);

  const category = PRODUCT_CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5">
      {PRODUCT_CATEGORIES.length > 1 && (
        <div className="flex gap-1 mb-5 bg-amber-50 rounded-xl p-1">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                activeCategory === cat.id
                  ? "bg-white text-amber-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {category.items.map((item) => (
        <div key={item.id} className="mb-5">
          <h3 className="font-bold text-lg text-stone-700 mb-2">
            {item.label}{" "}
            <span className="text-amber-700 font-normal">${item.price}</span>
          </h3>
          <div className="space-y-2">
            {category.flavours.map((flavour) => {
              const qty = quantities[cartKey(item.id, flavour)] ?? 0;
              return (
                <FlavourRow
                  key={flavour}
                  flavour={flavour}
                  qty={qty}
                  onDecrement={() => onChangeQty(item.id, flavour, -1)}
                  onIncrement={() => onChangeQty(item.id, flavour, 1)}
                />
              );
            })}
          </div>
        </div>
      ))}

      {cartItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-amber-100">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
            Your selection
          </p>
          {cartItems.map((item) => (
            <div
              key={cartKey(item.loafId, item.flavour)}
              className="flex justify-between text-sm text-stone-600 py-0.5"
            >
              <span>
                {item.qty}× {item.loafLabel} ({item.flavour})
              </span>
              <span>${(item.qty * item.unitPrice).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
