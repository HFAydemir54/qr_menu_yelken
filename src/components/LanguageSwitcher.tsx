"use client";

import { locales, localeMeta } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="inline-flex rounded-full border border-white/25 bg-white/10 p-1"
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            title={localeMeta[code].label}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition-colors ${
              active ? "bg-brand-gold text-brand-dark" : "text-white/80"
            }`}
          >
            {localeMeta[code].short}
          </button>
        );
      })}
    </div>
  );
}
