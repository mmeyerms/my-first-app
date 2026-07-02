import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { getServerLocale } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/client";
import { getServerTheme } from "@/lib/theme/server";
import { ThemeProvider } from "@/lib/theme/client";
import { BottomNav } from "@/components/layout/BottomNav";
import { HebammenChat } from "@/components/chat/HebammenChat";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";
import { getPreferences } from "@/lib/preferences/server";
import { PreferencesProvider } from "@/lib/preferences/client";
import { DEFAULT_PREFERENCES } from "@/lib/preferences/types";
import { PreferencesEffects } from "@/components/preferences/PreferencesEffects";
import { AutoLogoutEffect } from "@/components/security/AutoLogoutEffect";

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
  const [locale, theme] = await Promise.all([
    getServerLocale(),
    getServerTheme(),
  ]);

  let prefs = DEFAULT_PREFERENCES;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      prefs = await getPreferences(supabase, user.id);
    }
  } catch {
    // fall back to defaults; not blocking layout
  }
  return (
    <html
      lang={locale}
      data-theme={theme}
      data-accent={prefs.accentColor}
      data-fontsize={prefs.fontSize}
      className={`${fontDisplay.variable} ${fontSans.variable}`}
    >
      <body className="antialiased pb-[calc(env(safe-area-inset-bottom)+64px)] md:pb-0">
        <ThemeProvider initialTheme={theme}>
          <LocaleProvider initialLocale={locale}>
            <PreferencesProvider initialPrefs={prefs}>
              <PreferencesEffects />
              <AutoLogoutEffect />
              {children}
              <BottomNav />
              <HebammenChat />
              <Toaster position="top-center" richColors closeButton />
            </PreferencesProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
