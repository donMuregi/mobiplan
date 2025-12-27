import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MobiPlan - Phones & Electronics with Flexible Financing",
    template: "%s | MobiPlan"
  },
  description: "Shop quality phones, laptops, and electronics with flexible Sacco financing options. Buy cash or finance through Mwalimu Sacco, Yehu Microfinance, and more.",
  keywords: ["phones", "electronics", "financing", "sacco", "kenya", "smartphones", "laptops"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
