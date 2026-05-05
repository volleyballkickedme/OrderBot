import { cartKey, type QuantityMap } from "@/lib/order-utils";

interface ProductItemProps {
  item: { id: string; label: string; price: number };
  flavours: readonly string[];
  quantities: QuantityMap;
  onChangeQty: (itemId: string, flavour: string, delta: number) => void;
}

export function ProductItem({ item, flavours, quantities, onChangeQty }: ProductItemProps) {
  return (
    <div className="mb-5">
      <h3 className="font-bold text-lg text-stone-700 mb-2">
        {item.label}{" "}
        <span className="text-amber-700 font-normal">${item.price}</span>
      </h3>
      <div className="space-y-2">
        {flavours.map((flavour) => {
          const qty = quantities[cartKey(item.id, flavour)] ?? 0;
          return (
            <div
              key={flavour}
              className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
            >
              <span className="text-stone-600 text-sm flex-1">{flavour}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onChangeQty(item.id, flavour, -1)}
                  disabled={qty === 0}
                  className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-lg flex items-center justify-center disabled:opacity-30 active:bg-amber-200"
                >
                  −
                </button>
                <span className="w-5 text-center text-stone-700 font-medium">{qty}</span>
                <button
                  type="button"
                  onClick={() => onChangeQty(item.id, flavour, 1)}
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
