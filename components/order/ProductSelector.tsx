"use client";

import { useState } from "react";
import { cartKey, type QuantityMap } from "@/lib/order-utils";
import { ProductItem } from "./ProductItem";
import { CategoryTabBar } from "./CategoryTabBar";
import type { CartItem } from "@/lib/config";
import type { CategoryGroup } from "@/utils/supabase/types";

interface ProductSelectorProps {
  categoryGroups: CategoryGroup[];
  quantities: QuantityMap;
  onChangeQty: (menuItemId: string, loafName: string, delta: number) => void;
  cartItems: CartItem[];
}

export function ProductSelector({
  categoryGroups,
  quantities,
  onChangeQty,
  cartItems,
}: ProductSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categoryGroups[0]?.id ?? ""
  );

  const category = categoryGroups.find((c) => c.id === activeCategory) ?? categoryGroups[0];

  if (!category) {
    return (
      <section className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-stone-400 text-sm text-center py-4">No items available.</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5">
      {categoryGroups.length > 1 && (
        <CategoryTabBar
          categories={categoryGroups.map((g) => ({ id: g.id, label: g.label }))}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      )}

      {category.flavourGroups.map((flavourGroup) => (
        <ProductItem
          key={flavourGroup.flavour}
          flavourGroup={flavourGroup}
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
