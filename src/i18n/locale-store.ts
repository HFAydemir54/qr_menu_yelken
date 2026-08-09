import { defaultLocale, isLocale, type Locale } from "./config";

const STORAGE_KEY = "yelken-locale";

let current: Locale | null = null;
const listeners = new Set<() => void>();

function read(): Locale {
  if (current) return current;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  current = isLocale(saved) ? saved : defaultLocale;
  return current;
}

export const localeStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** İstemcide seçili dil; hiç seçim yapılmamışsa varsayılan (Türkçe). */
  getSnapshot: read,
  /** Sunucuda ve ilk render'da her zaman varsayılan dil kullanılır. */
  getServerSnapshot(): Locale {
    return defaultLocale;
  },
  set(next: Locale) {
    current = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    for (const listener of listeners) listener();
  },
};
