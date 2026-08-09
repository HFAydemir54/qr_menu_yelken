/**
 * Masalara koyulacak QR kodunu üretir.
 * Kullanım: node scripts/generate-qr.mjs https://menu.yelkenborek.com
 */
import { mkdir, writeFile } from "node:fs/promises";
import QRCode from "qrcode";

const url = process.argv[2];

if (!url) {
  console.error("Kullanım: node scripts/generate-qr.mjs <menü-adresi>");
  process.exit(1);
}

const options = {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 1200,
  color: { dark: "#3b2f2a", light: "#ffffff" },
};

await mkdir("public/qr", { recursive: true });
await QRCode.toFile("public/qr/menu-qr.png", url, options);
await writeFile("public/qr/menu-qr.svg", await QRCode.toString(url, { ...options, type: "svg" }));

console.log(`QR hazır → public/qr/menu-qr.png ve menu-qr.svg (${url})`);
