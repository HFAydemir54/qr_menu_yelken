"use client";

import { cafe } from "@/data/menu";
import { useLocale } from "@/i18n/LocaleProvider";

export function SiteFooter({ priceDate }: { priceDate: string }) {
  const { t } = useLocale();

  return (
    <footer className="mx-auto mt-14 max-w-3xl px-4 text-center text-sm text-brand-muted">
      <div className="rounded-2xl bg-brand-paper p-5 ring-1 ring-black/5">
        <p className="font-display text-lg font-bold text-brand-dark">
          {cafe.name}
        </p>
        <p className="mt-2">{cafe.address}</p>
        <a
          href={cafe.phoneHref}
          className="mt-1 block font-medium text-brand-dark"
          dir="ltr"
        >
          {cafe.phone}
        </a>
        <p className="mt-4 text-xs">
          {t("taxNote")} {t("priceDate")}: {priceDate}
        </p>
      </div>
    </footer>
  );
}
