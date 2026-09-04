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
  metadataBase: new URL("https://kindleaf.in"),
  title: {
    default: "Kindleaf | Official Brand & Product Information",
    template: "%s | Kindleaf Herbal Tea",
  },
  description: "Official brand website for Kindleaf. Discover our 100% natural, handcrafted blend of premium green tea, Holy Basil (Tulsi), Lemongrass, and dry Ginger root. Sourced with care in Jasrana, Uttar Pradesh.",
  keywords: [
    "Kindleaf",
    "Kindleaf herbal tea",
    "herbal green tea",
    "tulsi green tea",
    "lemongrass ginger tea",
    "Indian herbal tea",
    "mindful tea ritual",
    "small batch green tea"
  ],
  authors: [{ name: "Kindleaf Wellness" }],
  creator: "Kindleaf",
  publisher: "Kindleaf",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://kindleaf.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kindleaf.in",
    title: "Kindleaf | Handcrafted Herbal Green Tea",
    description: "Awaken Your Senses, Restore Your Calm. Discover our 100% natural handcrafted blend of green tea, Tulsi, Lemongrass, and dry Ginger.",
    siteName: "Kindleaf Official Brand",
    images: [
      {
        url: "/assets/hero_tea_cup.png",
        width: 1200,
        height: 630,
        alt: "Kindleaf Handcrafted Herbal Green Tea",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kindleaf | Handcrafted Herbal Green Tea",
    description: "A handcrafted herbal green tea made with green tea, tulsi, lemongrass and ginger — blended for a simple, mindful tea ritual.",
    images: ["/assets/hero_tea_cup.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kindleaf.in/#organization",
      "name": "Kindleaf Herbal Tea",
      "url": "https://kindleaf.in",
      "logo": "https://kindleaf.in/assets/logo.png",
      "description": "Official brand of handcrafted herbal green tea made with green tea, holy basil, lemongrass, and dry ginger.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Vill. Katoora, post darapur milawali",
        "addressLocality": "Jasrana, Firozabad",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "283136",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-6396461480",
        "contactType": "customer service",
        "email": "support@kindleaf.in"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://kindleaf.in/#website",
      "url": "https://kindleaf.in",
      "name": "Kindleaf",
      "publisher": {
        "@id": "https://kindleaf.in/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-[#e2e8f0] bg-[#0c1912] selection:bg-[#c5a880] selection:text-black">
        {children}
      </body>
    </html>
  );
}
