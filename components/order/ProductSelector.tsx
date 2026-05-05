import { LOAF_TYPES, FLAVOURS, type CartItem } from "@/lib/config";
import { cartKey, type QuantityMap } from "@/lib/order-utils";
import { FlavourRow } from "./FlavourRow";

interface ProductSelectorProps {
  quantities: QuantityMap;
  onChangeQty: (loafId: string, flavour: string, delta: number) => void;
  cartItems: CartItem[];
}

export function ProductSelector({ quantities, onChangeQty, cartItems }: ProductSelectorProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-semibold text-amber-900 mb-4">Select Your Bread</h2>
      {LOAF_TYPES.map((loaf) => (
        <div key={loaf.id} className="mb-5">
          <h3 className="font-bold text-lg text-stone-700 mb-2">
            {loaf.label}{" "}
            <span className="text-amber-700 font-normal">${loaf.price}</span>
          </h3>
          <div className="space-y-2">
            {FLAVOURS.map((flavour) => {
              const qty = quantities[cartKey(loaf.id, flavour)] ?? 0;
              return (
                <FlavourRow
                  key={flavour}
                  flavour={flavour}
                  qty={qty}
                  onDecrement={() => onChangeQty(loaf.id, flavour, -1)}
                  onIncrement={() => onChangeQty(loaf.id, flavour, 1)}
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
