import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Database } from "lucide-react";
import AdminSidebar from "@/client/components/admin/AdminSidebar";
import { I18nProvider } from "@/client/i18n";
import { getCurrentAdmin } from "@/server/auth";
import { getI18n } from "@/server/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    title: {
      default: dict.admin.meta.dashboard,
      template: dict.admin.meta.template,
    },
    robots: { index: false, follow: false },
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login?next=/admin");

  const { locale, dict, dir, htmlLang } = await getI18n();

  return (
    <I18nProvider locale={locale}>
      <div
        dir={dir}
        lang={htmlLang}
        className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[272px_1fr]"
      >
        <AdminSidebar email={admin.email} />
        <main className="min-w-0">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-6 flex items-center justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Database className="h-3.5 w-3.5" aria-hidden />
                {dict.admin.common.databaseConnected}
              </span>
            </div>
            {children}
          </div>
        </main>
      </div>
    </I18nProvider>
  );
}
