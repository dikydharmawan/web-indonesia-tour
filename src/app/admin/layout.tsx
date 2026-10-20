import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Database } from "lucide-react";
import AdminSidebar from "@/client/components/admin/AdminSidebar";
import { getCurrentAdmin } from "@/server/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Dashboard Admin",
    template: "%s | Dashboard",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login?next=/admin");

  return (
    <div
      dir="ltr"
      lang="id"
      className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[272px_1fr]"
    >
      <AdminSidebar email={admin.email} />
      <main className="min-w-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex items-center justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Database className="h-3.5 w-3.5" aria-hidden />
              Database terhubung
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
