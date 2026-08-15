"use client";

import { useActionState } from "react";
import type { MenuCategory } from "@/data/menu";
import { logoutAction, savePricesAction, type ActionState } from "./actions";

const initial: ActionState = {};

export function PriceEditor({
  categories,
  priceDate,
  source,
}: {
  categories: MenuCategory[];
  priceDate: string;
  source: "github" | "local";
}) {
  const [state, action, pending] = useActionState(savePricesAction, initial);

  return (
    <form action={action} className="mx-auto max-w-3xl px-4 pb-32 pt-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-dark">
            Fiyat Yönetimi
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            {source === "github"
              ? "Veriler GitHub'daki güncel menü dosyasından okundu."
              : "GitHub bağlantısı yok, sitedeki yayınlanmış menü gösteriliyor."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => logoutAction()}
          className="shrink-0 cursor-pointer rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium"
        >
          Çıkış
        </button>
      </header>

      <label className="mt-5 block rounded-2xl bg-brand-paper p-4 shadow-sm ring-1 ring-black/5">
        <span className="text-xs font-bold uppercase tracking-wide text-brand-muted">
          Fiyat geçerlilik tarihi
        </span>
        <input
          type="text"
          name="priceDate"
          defaultValue={priceDate}
          placeholder="04.02.2026"
          className="mt-2 w-40 rounded-xl border border-black/10 bg-white px-3 py-2 text-base outline-none focus:border-brand-gold"
        />
      </label>

      {categories.map((category, c) => (
        <section key={category.id} className="mt-8">
          <h2 className="font-display flex items-center gap-2 text-xl font-bold text-brand-dark">
            <span aria-hidden>{category.icon}</span>
            {category.name}
          </h2>

          {category.groups.map((group, g) => (
            <div key={group.title ?? g} className="mt-3">
              {group.title && (
                <h3 className="mb-2 inline-block rounded-md bg-brand-gold/25 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
                  {group.title}
                </h3>
              )}
              <ul className="overflow-hidden rounded-2xl bg-brand-paper shadow-sm ring-1 ring-black/5">
                {group.items.map((item, i) => (
                  <li
                    key={`${item.name}-${item.note ?? ""}-${i}`}
                    className="flex items-center gap-3 border-b border-black/5 px-4 py-3 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{item.name}</p>
                      {item.note && (
                        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-brand-muted">
                          {item.note}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={1}
                        name={`price:${c}:${g}:${i}`}
                        defaultValue={item.price ?? ""}
                        aria-label={`${item.name} fiyatı`}
                        className="w-24 rounded-xl border border-black/10 bg-white px-3 py-2 text-right text-base tabular-nums outline-none focus:border-brand-gold"
                      />
                      <span className="text-sm text-brand-muted">₺</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-brand-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1 text-sm">
            {state.error && (
              <p className="font-medium text-red-600">{state.error}</p>
            )}
            {state.success && (
              <p className="font-medium text-green-700">{state.success}</p>
            )}
            {!state.error && !state.success && (
              <p className="text-brand-muted">
                Kaydedince GitHub&apos;a commit atılır ve site yeniden yayınlanır.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 cursor-pointer rounded-xl bg-brand-dark px-5 py-3 font-semibold text-brand-gold-soft disabled:opacity-60"
          >
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </form>
  );
}
