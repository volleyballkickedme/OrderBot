"use client";

import { useRef, useState } from "react";
import {
  LOAF_TYPES,
  FLAVOURS,
  DELIVERY_OPTIONS,
  type CartItem,
  type DeliveryId,
} from "@/lib/config";

type QuantityMap = Record<string, number>;

function cartKey(loafId: string, flavour: string) {
  return `${loafId}::${flavour}`;
}

function isValidSgPhone(val: string) {
  return /^(\+65)?[689]\d{7}$/.test(val.trim().replace(/\s/g, ""));
}

function buildCartItems(quantities: QuantityMap): CartItem[] {
  const items: CartItem[] = [];
  for (const loaf of LOAF_TYPES) {
    for (const flavour of FLAVOURS) {
      const qty = quantities[cartKey(loaf.id, flavour)] ?? 0;
      if (qty > 0) {
        items.push({
          loafId: loaf.id,
          loafLabel: loaf.label,
          flavour,
          qty,
          unitPrice: loaf.price,
        });
      }
    }
  }
  return items;
}

export default function OrderPage() {
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [delivery, setDelivery] = useState<DeliveryId>("pickup");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cartItems = buildCartItems(quantities);
  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const total = subtotal + deliveryOption.surcharge;

  const canSubmit =
    cartItems.length > 0 &&
    name.trim() !== "" &&
    isValidSgPhone(contact) &&
    file !== null &&
    !submitting;

  function changeQty(loafId: string, flavour: string, delta: number) {
    const key = cartKey(loafId, flavour);
    setQuantities((prev) => {
      const next = Math.max(0, (prev[key] ?? 0) + delta);
      return { ...prev, [key]: next };
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !file) return;
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("contact", contact.trim());
    formData.append("deliveryMethod", deliveryOption.label);
    formData.append("total", total.toFixed(2));
    formData.append("items", JSON.stringify(cartItems));
    formData.append("paymentProof", file);

    try {
      const res = await fetch("/api/order", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-amber-50">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🍞</div>
          <h1 className="text-2xl font-bold text-amber-900 mb-2">Order Received!</h1>
          <p className="text-stone-600">
            Thank you, <strong>{name}</strong>! Your order has been sent. We&apos;ll be in
            touch soon.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🍞</div>
          <h1 className="text-2xl font-bold text-amber-900">Place Your Order</h1>
          <p className="text-stone-500 text-sm mt-1">Fresh artisan bread, made with love</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── SECTION 1: Product Selection ── */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">Select Your Bread</h2>
            {LOAF_TYPES.map((loaf) => (
              <div key={loaf.id} className="mb-5">
                <h3 className="font-medium text-stone-700 mb-2">
                  {loaf.label}{" "}
                  <span className="text-amber-700 font-normal">${loaf.price}</span>
                </h3>
                <div className="space-y-2">
                  {FLAVOURS.map((flavour) => {
                    const qty = quantities[cartKey(loaf.id, flavour)] ?? 0;
                    return (
                      <div
                        key={flavour}
                        className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
                      >
                        <span className="text-stone-600 text-sm flex-1">{flavour}</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => changeQty(loaf.id, flavour, -1)}
                            disabled={qty === 0}
                            className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-lg flex items-center justify-center disabled:opacity-30 active:bg-amber-200"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-stone-700 font-medium">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQty(loaf.id, flavour, 1)}
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
            ))}

            {/* Cart summary */}
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

          {/* ── SECTION 2: Delivery Method ── */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">Fulfillment Method</h2>
            <div className="space-y-2">
              {DELIVERY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    delivery === opt.id
                      ? "border-amber-400 bg-amber-50"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      checked={delivery === opt.id}
                      onChange={() => setDelivery(opt.id)}
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

          {/* ── LIVE TOTAL ── */}
          <div className="bg-amber-700 text-white rounded-2xl px-5 py-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-amber-200 text-sm">
                {cartItems.length === 0
                  ? "Add items to see total"
                  : `${cartItems.reduce((s, i) => s + i.qty, 0)} item${
                      cartItems.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""
                    } · ${deliveryOption.label}`}
              </p>
              <p className="font-bold text-xl">${total.toFixed(2)}</p>
            </div>
            <span className="text-3xl">🧾</span>
          </div>

          {/* ── SECTION 3: Customer Info ── */}
          <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <h2 className="text-lg font-semibold text-amber-900">Your Details</h2>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setContact(e.target.value)}
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
          </section>

          {/* ── SECTION 4: Payment Proof ── */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-amber-900 mb-1">Payment Proof</h2>
            <p className="text-stone-500 text-sm mb-4">
              Please transfer the total amount via PayNow/Bank Transfer, then upload your
              screenshot below.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.heic"
              onChange={handleFileChange}
              className="hidden"
            />

            {!file ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-amber-300 rounded-xl py-8 flex flex-col items-center gap-2 text-amber-700 hover:bg-amber-50 active:bg-amber-100 transition-colors"
              >
                <span className="text-3xl">📎</span>
                <span className="font-medium">Tap to upload screenshot</span>
                <span className="text-xs text-stone-400">JPG, PNG, HEIC accepted</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Payment proof preview"
                    className="w-20 h-20 object-cover rounded-lg border border-stone-200"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{file.name}</p>
                  <p className="text-xs text-green-600 mt-0.5">✓ Upload ready</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-stone-400 hover:text-stone-600 text-xl"
                >
                  ×
                </button>
              </div>
            )}
          </section>

          {/* ── ERROR ── */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* ── SUBMIT ── */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-amber-700 text-white font-bold py-4 rounded-2xl text-lg shadow-sm disabled:opacity-40 active:bg-amber-800 transition-colors"
          >
            {submitting ? "Sending Order…" : "Submit Order"}
          </button>

          {!canSubmit && !submitting && (
            <p className="text-center text-xs text-stone-400">
              {cartItems.length === 0
                ? "Add at least one item to continue"
                : !name.trim() || !isValidSgPhone(contact)
                ? "Please fill in your name and a valid contact number"
                : "Please upload your payment screenshot"}
            </p>
          )}

          <div className="h-4" />
        </form>
      </div>
    </main>
  );
}
