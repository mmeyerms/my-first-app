import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { getServerLocale } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/client";

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const fontSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MamaMap",
  description: "Deine Begleiterin durch die Schwangerschaft",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  return (
    <html lang={locale} className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body className="antialiased">
        <LocaleProvider initialLocale={locale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
