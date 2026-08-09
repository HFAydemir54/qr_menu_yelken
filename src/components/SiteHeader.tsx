"use client";

import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cafe } from "@/data/menu";
import { useLocale } from "@/i18n/LocaleProvider";

export function SiteHeader() {
  const { t } = useLocale();

  return (
    <header className="wood px-4 pb-10 pt-5 text-center text-brand-cream">
      <div className="mx-auto flex max-w-3xl justify-end">
        <LanguageSwitcher />
      </div>

      <Logo className="mx-auto mt-2 h-24 w-24 drop-shadow-lg" />
      <h1 className="font-display mt-4 text-3xl font-bold tracking-wide text-white">
        YELKEN
      </h1>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold">
        Börek Cafe
      </p>
      <p className="mt-3 text-sm text-brand-cream/80">{t("tagline")}</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="rounded-full bg-white/10 px-3 py-1.5">
          ⭐ {cafe.rating.toLocaleString("tr-TR")} · {cafe.reviewCount}{" "}
          {t("reviews")}
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1.5">
          🕒 {t("hours")}
        </span>
      </div>
    </header>
  );
}
