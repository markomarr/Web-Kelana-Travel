import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Pengaturan</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola informasi bisnis, hero, dan integrasi yang tampil di situs.</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
