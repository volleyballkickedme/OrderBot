# Simply Sourdough — OrderBot

A lightweight bread ordering app for artisan sourdough bakers. Customers pick loaves and flavors, enter delivery details, upload payment proof, and submit — the order lands in a Telegram group chat, ready for fulfillment. No database or user accounts required.

## How it works

1. Customer fills out the order form (items, delivery method, date, contact info)
2. Customer uploads a screenshot of their payment transfer
3. On submit, the server sends a formatted message + payment photo to a Telegram group
4. The baker fulfills from Telegram

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS v4** for styling
- **Telegram Bot API** for order notifications
