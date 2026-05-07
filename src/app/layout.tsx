import type { Metadata } from "next";
import "./globals.css";
import { getServerLocale } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/client";

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
    <html lang={locale}>
      <body className="antialiased">
        <LocaleProvider initialLocale={locale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
