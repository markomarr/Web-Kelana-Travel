import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userName = session?.user?.name ?? session?.user?.email ?? "Admin";

  return <AdminShell userName={userName}>{children}</AdminShell>;
}
