import { NextRequest, NextResponse } from "next/server";
import type { CartItem } from "@/lib/config";

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json(
      { error: "Server is not configured. Please contact the baker." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const name = formData.get("name");
  const contact = formData.get("contact");
  const deliveryMethod = formData.get("deliveryMethod");
  const deliveryDate = formData.get("deliveryDate");
  const deliveryLabel = formData.get("deliveryLabel");
  const address = formData.get("address"); // only present for delivery orders
  const total = formData.get("total");
  const itemsRaw = formData.get("items");
  const paymentProof = formData.get("paymentProof");

  if (
    typeof name !== "string" ||
    typeof contact !== "string" ||
    typeof deliveryMethod !== "string" ||
    typeof deliveryDate !== "string" ||
    typeof deliveryLabel !== "string" ||
    typeof total !== "string" ||
    typeof itemsRaw !== "string" ||
    !(paymentProof instanceof Blob)
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  let items: CartItem[];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    return NextResponse.json({ error: "Invalid items data." }, { status: 400 });
  }

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [year, month, day] = deliveryDate.split("-");
  const formattedDeliveryDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;

  const itemLines = items
    .map((item) => `• ${item.qty}x ${item.loafLabel} (${item.flavour})`)
    .join("\n");

  const addressLine = typeof address === "string" ? `\n🏠 *Address:* ${address}` : "";

  const caption =
    `🍞 *New Order Received*\n` +
    `👤 *Customer:* ${name}\n` +
    `📞 *Contact:* ${contact}\n\n` +
    `*Items:*\n${itemLines}\n\n` +
    `🚚 *Method:* ${deliveryMethod}\n` +
    `📅 *${deliveryLabel}:* ${formattedDeliveryDate}` +
    addressLine + `\n` +
    `💰 *Total Amount:* $${total}`;

  // Forward the image to Telegram via sendPhoto
  const tgForm = new FormData();
  tgForm.append("chat_id", chatId);
  tgForm.append("caption", caption);
  tgForm.append("parse_mode", "Markdown");
  tgForm.append("photo", paymentProof, "payment.jpg");

  const tgRes = await fetch(
    `https://api.telegram.org/bot${botToken}/sendPhoto`,
    { method: "POST", body: tgForm }
  );

  if (!tgRes.ok) {
    const tgError = await tgRes.json().catch(() => ({}));
    console.error("Telegram API error:", tgError);
    return NextResponse.json(
      { error: "Failed to send order notification. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
