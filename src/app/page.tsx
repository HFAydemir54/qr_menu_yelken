import { MenuBrowser } from "@/components/MenuBrowser";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getPublicMenu } from "@/lib/menu-repo";

export default async function Home() {
  const { categories, priceDate } = await getPublicMenu();

  return (
    <LocaleProvider>
      <main className="pb-16">
        <SiteHeader />
        <MenuBrowser menu={categories} />
        <SiteFooter priceDate={priceDate} />
      </main>
    </LocaleProvider>
  );
}
