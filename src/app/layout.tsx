import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kindleaf | Premium Handcrafted Herbal Green Tea",
  description: "100% natural, handcrafted herbal green tea infused with organic tulsi leaves, lemongrass, and dry ginger to support immunity, gut health, and daily wellness.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-[#e2e8f0] bg-[#0c1912] selection:bg-[#c5a880] selection:text-black">
        {children}
      </body>
    </html>
  );
}
