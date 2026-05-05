interface FlavourRowProps {
  flavour: string;
  qty: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

export function FlavourRow({ flavour, qty, onDecrement, onIncrement }: FlavourRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
      <span className="text-stone-600 text-sm flex-1">{flavour}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={qty === 0}
          className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-lg flex items-center justify-center disabled:opacity-30 active:bg-amber-200"
        >
          −
        </button>
        <span className="w-5 text-center text-stone-700 font-medium">{qty}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-lg flex items-center justify-center active:bg-amber-200"
        >
          +
        </button>
      </div>
    </div>
  );
}
