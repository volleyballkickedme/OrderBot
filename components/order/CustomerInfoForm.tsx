import { Calendar } from "@/components/ui/calendar";
import { isValidSgPhone } from "@/lib/order-utils";

interface CustomerInfoFormProps {
  name: string;
  onNameChange: (v: string) => void;
  contact: string;
  onContactChange: (v: string) => void;
  selectedDay: Date | undefined;
  onDaySelect: (d: Date | undefined) => void;
  isDelivery: boolean;
  address: string;
  onAddressChange: (v: string) => void;
}

export function CustomerInfoForm({
  name,
  onNameChange,
  contact,
  onContactChange,
  selectedDay,
  onDaySelect,
  isDelivery,
  address,
  onAddressChange,
}: CustomerInfoFormProps) {
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <h2 className="text-lg font-semibold text-amber-900">Your Details</h2>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Your full name"
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          Contact Number
        </label>
        <input
          type="tel"
          value={contact}
          onChange={(e) => onContactChange(e.target.value)}
          placeholder="e.g. 91234567"
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
        {contact.trim() !== "" && !isValidSgPhone(contact) && (
          <p className="text-xs text-red-500 mt-1">
            Enter a valid Singapore number (e.g. 91234567 or +6591234567)
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-stone-600 mb-1">
          Preferred {isDelivery ? "Delivery" : "Pickup"} Date
        </label>
        <div className="border border-stone-300 rounded-xl overflow-hidden">
          <Calendar
            mode="single"
            selected={selectedDay}
            onSelect={onDaySelect}
            disabled={[{ dayOfWeek: [2, 3, 4, 5] }, { before: minDate }]}
            startMonth={minDate}
            weekStartsOn={1}
            classNames={{ root: "w-full" }}
          />
        </div>
        <p className="text-xs text-stone-400 mt-1">Available on Mon, Sat &amp; Sun only</p>
      </div>
      {isDelivery && (
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">
            Delivery Address
          </label>
          <textarea
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Block, street, unit number, postal code"
            required
            rows={3}
            className="w-full border border-stone-300 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
          />
        </div>
      )}
    </section>
  );
}
