import SiteHeader from "@/client/components/site/SiteHeader";
import SiteFooter from "@/client/components/site/SiteFooter";
import { I18nProvider } from "@/client/i18n";
import { getI18n } from "@/server/i18n";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, dir } = await getI18n();

  return (
    <I18nProvider locale={locale}>
      <div className="flex min-h-screen flex-col" dir={dir}>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </I18nProvider>
  );
}
