"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Localized, MenuCategory } from "@/data/menu";
import { useLocale } from "@/i18n/LocaleProvider";

const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

function formatPrice(price: number | null) {
  return price === null ? "₺" : priceFormatter.format(price);
}

/** Türkçe karakterleri normalize ederek arama yapmayı sağlar. */
function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

function filterCategory(
  category: MenuCategory,
  query: string,
  m: (text: Localized | null) => string,
) {
  const q = normalize(query.trim());
  if (!q) return category;

  return {
    ...category,
    groups: category.groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            normalize(item.name.tr).includes(q) ||
            normalize(m(item.name)).includes(q) ||
            normalize(item.note?.tr ?? "").includes(q) ||
            normalize(m(item.note)).includes(q),
        ),
      }))
      .filter((group) => group.items.length > 0),
  };
}

export function MenuBrowser({ menu }: { menu: MenuCategory[] }) {
  const { t, m } = useLocale();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(menu[0]?.id);
  const navRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const catHeadRef = useRef<HTMLDivElement>(null);

  const activeCategory = useMemo(
    () => menu.find((category) => category.id === activeId) ?? menu[0],
    [menu, activeId],
  );
  const visible = useMemo(
    () => activeCategory && filterCategory(activeCategory, query, m),
    [activeCategory, query, m],
  );

  // Yapışkan başlıkların üst konumu için gerçek yükseklikleri ölç
  useEffect(() => {
    const targets: [HTMLElement | null, string][] = [
      [barRef.current, "--tabbar-h"],
      [catHeadRef.current, "--cathead-h"],
    ];
    const sync = () => {
      for (const [el, name] of targets) {
        if (el) {
          document.documentElement.style.setProperty(
            name,
            `${Math.round(el.getBoundingClientRect().height)}px`,
          );
        }
      }
    };
    sync();

    const observer = new ResizeObserver(sync);
    for (const [el] of targets) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Seçili sekmeyi yatay barda görünür alana getir
  useEffect(() => {
    navRef.current
      ?.querySelector(`[data-cat="${activeId}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeId]);

  if (!activeCategory || !visible) return null;

  return (
    <>
      <div ref={barRef} className="sticky top-0 z-30 border-b border-black/10 bg-brand-cream/95 backdrop-blur">
        <div
          ref={navRef}
          role="tablist"
          aria-label={t("categories")}
          className="no-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-3"
        >
          {menu.map((category) => {
            const active = category.id === activeId;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="menu-panel"
                data-cat={category.id}
                onClick={() => setActiveId(category.id)}
                className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-brand-dark bg-brand-dark text-brand-gold-soft"
                    : "border-black/10 bg-white text-brand-ink"
                }`}
              >
                <span aria-hidden>{category.icon}</span>
                {m(category.name)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4">
        <label className="relative mt-5 block">
          <span className="sr-only">{t("searchLabel")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`${m(activeCategory.name)} ${t("searchIn")}`}
            className="w-full rounded-2xl border border-black/10 bg-white py-3 pe-4 ps-11 text-base outline-none placeholder:text-brand-muted focus:border-brand-gold"
          />
          <svg
            className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
        </label>

        <section
          id="menu-panel"
          role="tabpanel"
          aria-label={m(activeCategory.name)}
          className="pt-6"
        >
          {/* Sekme barının altına yapışır, kategori boyunca ekranda kalır */}
          <div ref={catHeadRef} className="sticky top-[var(--tabbar-h)] z-20 -mx-1 bg-brand-cream px-1 pb-2 pt-3">
            <h2 className="font-display flex items-center gap-2 text-2xl font-bold text-brand-dark">
              <span aria-hidden>{visible.icon}</span>
              {m(visible.name)}
            </h2>
            <div className="mt-1 h-1 w-16 rounded-full bg-brand-gold" />
          </div>

          {visible.groups.length === 0 && (
            <p className="py-16 text-center text-brand-muted">
              “{query}” {t("noResults")}
            </p>
          )}

          {visible.groups.map((group) => (
            <div key={group.id} className="mt-4">
              {group.title && (
                /* Sırası gelen alt başlık kategori başlığının altına yapışır */
                <div className="sticky top-[calc(var(--tabbar-h)+var(--cathead-h))] z-10 -mx-1 bg-brand-cream px-1 pb-2 pt-1">
                  <h3 className="inline-block rounded-md bg-brand-gold/25 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
                    {m(group.title)}
                  </h3>
                </div>
              )}
              <ul className="overflow-hidden rounded-2xl bg-brand-paper shadow-sm ring-1 ring-black/5">
                {group.items.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-start gap-3 border-b border-black/5 px-4 py-3 last:border-b-0 ${
                      item.available ? "" : "opacity-55"
                    }`}
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        width={64}
                        height={64}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{m(item.name)}</p>
                      {item.note && (
                        <p className="mt-0.5 text-xs leading-snug text-brand-muted">
                          {m(item.note)}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 pt-0.5 font-semibold tabular-nums text-brand-dark">
                      {item.available ? (
                        formatPrice(item.price)
                      ) : (
                        <span className="rounded-md bg-black/5 px-2 py-0.5 text-xs font-bold uppercase text-brand-muted">
                          {t("soldOut")}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
