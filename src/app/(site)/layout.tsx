import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings, getActiveRoutes } from "@/lib/queries";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, routes] = await Promise.all([getSiteSettings(), getActiveRoutes()]);

  return (
    <>
      <Navbar
        siteName={settings?.siteName ?? "Kelana Travel"}
        phoneWhatsapp={settings?.phoneWhatsapp ?? ""}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} popularRoutes={routes.slice(0, 4)} />
    </>
  );
}
