"use client";

import { useState } from "react";
import { DELIVERY_OPTIONS, type DeliveryId } from "@/lib/config";
import {
  buildCartItems,
  cartKey,
  isAllowedDay,
  isValidSgPhone,
  type QuantityMap,
} from "@/lib/order-utils";
import { SuccessScreen } from "@/components/order/SuccessScreen";
import { ProductSelector } from "@/components/order/ProductSelector";
import { DeliverySelector } from "@/components/order/DeliverySelector";
import { OrderTotal } from "@/components/order/OrderTotal";
import { CustomerInfoForm } from "@/components/order/CustomerInfoForm";
import { PaymentUpload } from "@/components/order/PaymentUpload";
import { SubmitSection } from "@/components/order/SubmitSection";
import type { CategoryGroup } from "@/utils/supabase/types";

interface OrderFormProps {
  categoryGroups: CategoryGroup[];
}

export function OrderForm({ categoryGroups }: OrderFormProps) {
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [delivery, setDelivery] = useState<DeliveryId>("pickup");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [address, setAddress] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartItems = buildCartItems(quantities, categoryGroups);
  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const total = subtotal + deliveryOption.surcharge;
  const isDelivery = delivery === "standard";

  const deliveryDate = selectedDay
    ? `${selectedDay.getFullYear()}-${String(selectedDay.getMonth() + 1).padStart(2, "0")}-${String(selectedDay.getDate()).padStart(2, "0")}`
    : "";

  const canSubmit =
    cartItems.length > 0 &&
    name.trim() !== "" &&
    isValidSgPhone(contact) &&
    selectedDay !== undefined &&
    (!isDelivery || address.trim() !== "") &&
    file !== null &&
    !submitting;

  const validationHint =
    canSubmit || submitting
      ? null
      : cartItems.length === 0
      ? "Add at least one item to continue"
      : !name.trim() || !isValidSgPhone(contact)
      ? "Please fill in your name and a valid contact number"
      : deliveryDate === "" || !isAllowedDay(deliveryDate)
      ? `Please select a Monday, Saturday, or Sunday for ${isDelivery ? "delivery" : "pickup"}`
      : isDelivery && address.trim() === ""
      ? "Please enter your delivery address"
      : "Please upload your payment screenshot";

  function handleDeliveryChange(id: DeliveryId) {
    setDelivery(id);
    if (id !== "standard") setAddress("");
  }

  function changeQty(menuItemId: string, loafName: string, delta: number) {
    const key = cartKey(menuItemId, loafName);
    setQuantities((prev) => {
      const next = Math.max(0, (prev[key] ?? 0) + delta);
      return { ...prev, [key]: next };
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function handleClearFile() {
    setFile(null);
    setPreview(null);
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
    formData.append("deliveryDate", deliveryDate);
    formData.append("deliveryLabel", isDelivery ? "Delivery Date" : "Pickup Date");
    if (isDelivery) formData.append("address", address.trim());
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
    return <SuccessScreen name={name} />;
  }

  return (
    <main className="min-h-screen bg-amber-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-3xl sm:text-4xl mb-2">Simply Sourdough 🍞</div>
          <p className="text-stone-600 text-sm mt-1">
            (Orders are limited to 12 loaves a week on a first come first serve basis)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ProductSelector
            categoryGroups={categoryGroups}
            quantities={quantities}
            onChangeQty={changeQty}
            cartItems={cartItems}
          />
          <DeliverySelector value={delivery} onChange={handleDeliveryChange} />
          <OrderTotal cartItems={cartItems} total={total} deliveryOption={deliveryOption} />
          <CustomerInfoForm
            name={name}
            onNameChange={setName}
            contact={contact}
            onContactChange={setContact}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
            isDelivery={isDelivery}
            address={address}
            onAddressChange={setAddress}
          />
          <PaymentUpload
            file={file}
            preview={preview}
            onFileChange={handleFileChange}
            onClear={handleClearFile}
          />
          <SubmitSection
            canSubmit={canSubmit}
            submitting={submitting}
            error={error}
            validationHint={validationHint}
          />
          <div className="h-4" />
        </form>
      </div>
    </main>
  );
}
