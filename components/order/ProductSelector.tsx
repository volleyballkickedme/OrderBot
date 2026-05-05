"use client";

import { useState } from "react";
import { PRODUCT_CATEGORIES, type CategoryId, type CartItem } from "@/lib/config";
import { cartKey, type QuantityMap } from "@/lib/order-utils";
import { ProductItem } from "./ProductItem";
import { CategoryTabBar } from "./CategoryTabBar";

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
        <CategoryTabBar
          categories={PRODUCT_CATEGORIES}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      )}

      {category.items.map((item) => (
        <ProductItem
          key={item.id}
          item={item}
          flavours={category.flavours}
          quantities={quantities}
          onChangeQty={onChangeQty}
        />
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
