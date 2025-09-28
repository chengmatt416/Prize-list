import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prize List - Stamp Collection Rewards",
  description: "Collect stamps and redeem amazing prizes! Modern prize list management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
