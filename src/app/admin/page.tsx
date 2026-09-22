import type { Metadata } from "next";
import { isLoggedIn } from "@/lib/admin-auth";
import { fetchMenu } from "@/lib/menu-repo";
import { LoginForm } from "./LoginForm";
import { MenuAdmin } from "./MenuAdmin";

export const metadata: Metadata = {
  title: "Yönetim Paneli",
  robots: { index: false, follow: false },
};

/** Panel her zaman güncel veriyi göstermeli; ön-render edilmez. */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isLoggedIn())) return <LoginForm />;

  const { categories, priceDate } = await fetchMenu();
  return <MenuAdmin categories={categories} priceDate={priceDate} />;
}
