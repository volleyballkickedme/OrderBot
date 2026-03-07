# Setup Guide

## 1. Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send the command `/newbot`
3. Follow the prompts — choose a name and username for your bot
4. BotFather will give you a **Bot Token** that looks like: `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`
5. Copy that token — you'll need it shortly

## 2. Set Up the Order Group Chat

Orders are delivered to a private group chat. No personal chat IDs are needed.

1. Create a new Telegram group (or use an existing one)
2. Add your bot to the group as a member
3. If the group has "only admins can send messages" enabled, also make the bot an **admin**
4. Send any message in the group (e.g. "test")
5. Open this URL in your browser, replacing `<TOKEN>` with your actual token:
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
6. Look for `"chat":{"id":` in the JSON response — the group chat ID is a **negative number**:
   ```json
   "chat": { "id": -1001234567890, "title": "Bread Orders", "type": "group" }
   ```
   Copy that negative number — it's your **Group Chat ID**

## 3. Configure Environment Variables

### For local development:

Create a file called `.env.local` in the project root (copy from `.env.local.example`):

```
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_CHAT_ID=-1001234567890
```

Then run:
```bash
npm run dev
```

### For Vercel deployment:

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Before deploying, go to **Settings → Environment Variables** and add:
   - `TELEGRAM_BOT_TOKEN` → your bot token
   - `TELEGRAM_CHAT_ID` → your group chat ID (the negative number)
4. Deploy — Vercel will give you a public URL to share with customers

## 4. Update Prices

All prices are in [`lib/config.ts`](lib/config.ts). Edit the values there:

```ts
export const LOAF_TYPES = [
  { id: "rustic", label: "Rustic Loaf", price: 12 },      // ← change price here
  { id: "sandwich", label: "Sandwich Loaf", price: 10 },  // ← and here
];

export const DELIVERY_OPTIONS = [
  { id: "pickup",   label: "Self-Pickup",        surcharge: 0  },
  { id: "standard", label: "Standard Delivery",  surcharge: 5  }, // ← and here
  { id: "cbd",      label: "CBD Delivery",        surcharge: 10 }, // ← and here
];
```
