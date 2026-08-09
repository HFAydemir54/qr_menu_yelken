import { Logo } from "@/components/Logo";
import { MenuBrowser } from "@/components/MenuBrowser";
import { cafe } from "@/data/menu";

export default function Home() {
  return (
    <main className="pb-16">
      <header className="wood px-4 pb-10 pt-9 text-center text-brand-cream">
        <Logo className="mx-auto h-24 w-24 drop-shadow-lg" />
        <h1 className="font-display mt-4 text-3xl font-bold tracking-wide text-white">
          YELKEN
        </h1>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold">
          Börek Cafe
        </p>
        <p className="mt-3 text-sm text-brand-cream/80">{cafe.tagline}</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="rounded-full bg-white/10 px-3 py-1.5">
            ⭐ {cafe.rating.toLocaleString("tr-TR")} · {cafe.reviewCount} yorum
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5">
            🕒 {cafe.hours}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <a
            href={cafe.phoneHref}
            className="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-dark"
          >
            📞 Ara
          </a>
          <a
            href={cafe.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white"
          >
            📍 Yol Tarifi
          </a>
        </div>
      </header>

      <MenuBrowser />

      <footer className="mx-auto mt-14 max-w-3xl px-4 text-center text-sm text-brand-muted">
        <div className="rounded-2xl bg-brand-paper p-5 ring-1 ring-black/5">
          <p className="font-display text-lg font-bold text-brand-dark">
            {cafe.name}
          </p>
          <p className="mt-2">{cafe.address}</p>
          <a href={cafe.phoneHref} className="mt-1 block font-medium text-brand-dark">
            {cafe.phone}
          </a>
          <p className="mt-4 text-xs">
            Fiyatlarımızda tüm vergiler dahildir. Fiyat değişim tarihi:{" "}
            {cafe.priceDate}
          </p>
        </div>
      </footer>
    </main>
  );
}
