"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  createSession,
  destroySession,
  isLoggedIn,
} from "@/lib/admin-auth";
import { commitMenuFile, readMenuFile } from "@/lib/github";
import type { MenuCategory } from "@/data/menu";

export type ActionState = { error?: string; success?: string };

export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Şifre girin." };

  try {
    if (!checkPassword(password)) return { error: "Şifre hatalı." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Giriş yapılamadı." };
  }

  await createSession();
  revalidatePath("/admin");
  return {};
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin");
}

type MenuFile = { priceDate: string; categories: MenuCategory[] };

/**
 * Formdaki fiyatları depodaki güncel menu.json üzerine uygular ve commit'ler.
 * Alan adları `price:<kategoriIndex>:<grupIndex>:<ürünIndex>` biçimindedir.
 */
export async function savePricesAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isLoggedIn())) return { error: "Oturum sona erdi, tekrar giriş yapın." };

  try {
    const { content, sha } = await readMenuFile();
    const data = JSON.parse(content) as MenuFile;

    let changed = 0;
    for (const [key, raw] of formData.entries()) {
      if (!key.startsWith("price:")) continue;

      const [, c, g, i] = key.split(":").map(Number);
      const item = data.categories[c]?.groups[g]?.items[i];
      if (!item) continue;

      const value = String(raw).trim().replace(",", ".");
      const next = value === "" ? null : Number(value);
      if (next !== null && (!Number.isFinite(next) || next < 0)) {
        return { error: `Geçersiz fiyat: ${item.name} → "${value}"` };
      }
      if (next !== item.price) {
        item.price = next;
        changed += 1;
      }
    }

    const priceDate = String(formData.get("priceDate") ?? "").trim();
    const priceDateChanged = priceDate !== "" && priceDate !== data.priceDate;
    if (priceDateChanged) data.priceDate = priceDate;

    if (changed === 0 && !priceDateChanged) {
      return { success: "Değişiklik yok, kaydedilecek bir şey bulunamadı." };
    }

    await commitMenuFile(
      `${JSON.stringify(data, null, 2)}\n`,
      sha,
      `Fiyat güncellemesi (${changed} ürün) — admin panel`,
    );

    revalidatePath("/");
    revalidatePath("/admin");
    return {
      success: `${changed} ürün güncellendi. Yeni deploy başladı, site 1-2 dakika içinde yenilenecek.`,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Kaydedilemedi.",
    };
  }
}
