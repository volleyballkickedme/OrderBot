import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simply Sourdough",
  description: "Place your artisan bread order",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
