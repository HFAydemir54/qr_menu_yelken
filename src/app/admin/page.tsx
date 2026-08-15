import type { Metadata } from "next";
import { cafe, menu, type MenuCategory } from "@/data/menu";
import { isLoggedIn } from "@/lib/admin-auth";
import { readMenuFile } from "@/lib/github";
import { LoginForm } from "./LoginForm";
import { PriceEditor } from "./PriceEditor";

export const metadata: Metadata = {
  title: "Yönetim Paneli",
  robots: { index: false, follow: false },
};

/** Panel her zaman güncel veriyi göstermeli; ön-render edilmez. */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isLoggedIn())) return <LoginForm />;

  // Bekleyen bir deploy varsa bile son commit'lenmiş fiyatları göster.
  let categories: MenuCategory[] = menu;
  let priceDate = cafe.priceDate;
  let source: "github" | "local" = "local";

  try {
    const { content } = await readMenuFile();
    const data = JSON.parse(content) as {
      priceDate: string;
      categories: MenuCategory[];
    };
    categories = data.categories;
    priceDate = data.priceDate;
    source = "github";
  } catch {
    // GitHub yapılandırılmamışsa yerel veriyle devam et.
  }

  return (
    <PriceEditor
      categories={categories}
      priceDate={priceDate}
      source={source}
    />
  );
}
