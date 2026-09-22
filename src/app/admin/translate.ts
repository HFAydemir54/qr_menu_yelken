"use server";

import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { isLoggedIn } from "@/lib/admin-auth";

/**
 * Google Gemini (ücretsiz plan). Anahtar: GOOGLE_GENERATIVE_AI_API_KEY
 * (https://aistudio.google.com/apikey). Model GEMINI_MODEL ile değiştirilebilir;
 * varsayılan takma ad, Google eski modelleri kapattığında otomatik güncel modele geçer.
 */
const MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

export type TranslateField = {
  /** Alan adı (ör. "name", "note") */
  key: string;
  /** Formdaki güncel Türkçe metin */
  tr: string;
  /** Düzenlemeye başlamadan önceki Türkçe metin (yeni kayıtta boş) */
  previousTr: string;
  /** Mevcut çeviriler; varsa yalnızca değişen kısım güncellenir */
  en: string;
  ar: string;
};

export type TranslateResult =
  | { ok: true; fields: Record<string, { en: string; ar: string }> }
  | { ok: false; error: string };

const schema = z.object({
  fields: z.array(z.object({ key: z.string(), en: z.string(), ar: z.string() })),
});

const SYSTEM = `Sen bir kafenin (Yelken Börek Cafe, İstanbul) QR menüsü için çevirmensin.
Türkçe menü metinlerini İngilizce ve Arapçaya çevirirsin.

Kurallar:
- Menü dilinde, kısa ve doğal yaz. Açıklama ekleme, metni uzatma.
- Türk yemek adlarını (börek, pide, menemen, sucuk, kaşar, ayran, gözleme vb.) İngilizcede özgün adıyla bırak; gerekirse kısa açıklama değil, özgün ad yeterli. Arapçada yaygın Arapça yazımını kullan.
- Sayıları, fiyatları, "TL" ve "—" gibi işaretleri koru. Arapçada rakamları mevcut çeviride nasıl yazılmışsa öyle yaz; mevcut çeviri yoksa Arapça-Hint rakamları (٢٥٠) kullan.
- Büyük harf kullanımını Türkçe metne uydur (TAMAMI BÜYÜK HARF başlıklar İngilizcede de öyle kalsın).
- ÖNEMLİ: Bir alan için "önceki Türkçe" ve "mevcut çeviri" verilmişse, sıfırdan çevirme. Önceki Türkçe ile yeni Türkçeyi karşılaştır ve mevcut çeviride YALNIZCA değişen kısmı güncelle; geri kalan kelimeleri, sırayı ve üslubu aynen koru.
- Türkçe metin boşsa, o alan için en ve ar boş string olsun.`;

export async function translateAction(fields: TranslateField[]): Promise<TranslateResult> {
  if (!(await isLoggedIn())) return { ok: false, error: "Oturum sona erdi, tekrar giriş yapın." };

  const input = fields
    .filter((field) => typeof field?.key === "string" && typeof field?.tr === "string")
    .map((field) => ({
      key: field.key,
      tr: field.tr.trim().slice(0, 2000),
      previousTr: String(field.previousTr ?? "").trim().slice(0, 2000),
      en: String(field.en ?? "").trim().slice(0, 2000),
      ar: String(field.ar ?? "").trim().slice(0, 2000),
    }));
  if (input.length === 0 || input.every((field) => !field.tr)) {
    return { ok: false, error: "Önce Türkçe metni girin." };
  }

  const prompt = input
    .map((field) =>
      [
        `### Alan: ${field.key}`,
        `Yeni Türkçe: ${field.tr || "(boş)"}`,
        field.previousTr && (field.en || field.ar)
          ? [
              `Önceki Türkçe: ${field.previousTr}`,
              `Mevcut İngilizce: ${field.en || "(yok)"}`,
              `Mevcut Arapça: ${field.ar || "(yok)"}`,
            ].join("\n")
          : "(Mevcut çeviri yok, sıfırdan çevir.)",
      ].join("\n"),
    )
    .join("\n\n");

  try {
    const { output } = await generateText({
      model: google(MODEL),
      system: SYSTEM,
      prompt,
      output: Output.object({ schema }),
    });

    const result: Record<string, { en: string; ar: string }> = {};
    for (const field of input) {
      const translated = output.fields.find((item) => item.key === field.key);
      result[field.key] = field.tr
        ? { en: translated?.en.trim() ?? "", ar: translated?.ar.trim() ?? "" }
        : { en: "", ar: "" };
    }
    return { ok: true, fields: result };
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "";
    if (/api key|GOOGLE_GENERATIVE_AI_API_KEY/i.test(message)) {
      return { ok: false, error: "Çeviri servisi ayarlanmamış: GOOGLE_GENERATIVE_AI_API_KEY eksik veya geçersiz." };
    }
    if (/quota|rate|429|exhausted/i.test(message)) {
      return { ok: false, error: "Ücretsiz çeviri kotası doldu, bir dakika sonra tekrar deneyin." };
    }
    return { ok: false, error: "Çeviri yapılamadı, biraz sonra tekrar deneyin." };
  }
}
