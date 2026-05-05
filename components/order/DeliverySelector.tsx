import { DELIVERY_OPTIONS, type DeliveryId } from "@/lib/config";

interface DeliverySelectorProps {
  value: DeliveryId;
  onChange: (id: DeliveryId) => void;
}

export function DeliverySelector({ value, onChange }: DeliverySelectorProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-semibold text-amber-900 mb-4">Fulfillment Method</h2>
      <div className="space-y-2">
        {DELIVERY_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-colors ${
              value === opt.id
                ? "border-amber-400 bg-amber-50"
                : "border-stone-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                value={opt.id}
                checked={value === opt.id}
                onChange={() => onChange(opt.id)}
                className="accent-amber-600"
              />
              <span className="text-stone-700 font-medium">{opt.label}</span>
            </div>
            <span className="text-amber-700 font-semibold">
              {opt.surcharge === 0 ? "Free" : `+$${opt.surcharge}`}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
