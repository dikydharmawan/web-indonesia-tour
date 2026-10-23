import type { CSSProperties } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { getThemeSettings } from "@/server/data/theme";
import { getI18n } from "@/server/i18n";
import { themeCssVars } from "@/shared/theme";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    title: {
      default: `Jelajah Nusantara — ${dict.common.virtualTour}`,
      template: "%s | Jelajah Nusantara",
    },
    description: dict.footer.tagline,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [{ htmlLang, dir }, theme] = await Promise.all([
    getI18n(),
    getThemeSettings(),
  ]);

  return (
    <html
      lang={htmlLang}
      dir={dir}
      style={themeCssVars(theme) as CSSProperties}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
