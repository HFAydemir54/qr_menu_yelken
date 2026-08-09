import { MenuBrowser } from "@/components/MenuBrowser";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LocaleProvider } from "@/i18n/LocaleProvider";

export default function Home() {
  return (
    <LocaleProvider>
      <main className="pb-16">
        <SiteHeader />
        <MenuBrowser />
        <SiteFooter />
      </main>
    </LocaleProvider>
  );
}
