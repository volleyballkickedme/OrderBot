import { cartKey, type QuantityMap } from "@/lib/order-utils";
import type { FlavourGroup } from "@/utils/supabase/types";

interface ProductItemProps {
  flavourGroup: FlavourGroup;
  quantities: QuantityMap;
  onChangeQty: (menuItemId: string, loafName: string, delta: number) => void;
}

export function ProductItem({ flavourGroup, quantities, onChangeQty }: ProductItemProps) {
  const firstPrice = flavourGroup.loafOptions[0]?.price;

  return (
    <div className="mb-5">
      <h3 className="font-bold text-lg text-stone-700 mb-2">
        {flavourGroup.flavour}{" "}
        {firstPrice !== undefined && (
          <span className="text-amber-700 font-normal">${firstPrice}</span>
        )}
      </h3>
      <div className="space-y-2">
        {flavourGroup.loafOptions.map((option) => {
          const qty = quantities[cartKey(option.menuItemId, option.loafName)] ?? 0;
          return (
            <div
              key={option.menuItemId}
              className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
            >
              <span className="text-stone-600 text-sm flex-1">{option.loafName}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onChangeQty(option.menuItemId, option.loafName, -1)}
                  disabled={qty === 0}
                  className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-lg flex items-center justify-center disabled:opacity-30 active:bg-amber-200"
                >
                  −
                </button>
                <span className="w-5 text-center text-stone-700 font-medium">{qty}</span>
                <button
                  type="button"
                  onClick={() => onChangeQty(option.menuItemId, option.loafName, 1)}
                  className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-lg flex items-center justify-center active:bg-amber-200"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
