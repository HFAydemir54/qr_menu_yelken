"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { localeMeta, type Locale } from "./config";
import { localeStore } from "./locale-store";
import type { Localized } from "@/data/menu";
import { t as translateUi, type UiKey } from "./ui";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Arayüz metni */
  t: (key: UiKey) => string;
  /** Menü metni; seçili dilde karşılığı yoksa Türkçesi döner. */
  m: (text: Localized | null | undefined) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    localeStore.subscribe,
    localeStore.getSnapshot,
    localeStore.getServerSnapshot,
  );

  // <html lang> ve yazı yönünü seçili dile göre güncelle
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeMeta[locale].dir;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: localeStore.set,
      t: (key) => translateUi(key, locale),
      m: (text) => (text ? (text[locale] ?? text.tr) : ""),
    }),
    [locale],
  );

  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale, LocaleProvider içinde kullanılmalı");
  return context;
}
