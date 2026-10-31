/**
 * Monogram W&T: assets-source/logo/WT_Logo.ai → public/logo/monogram.webp.
 *
 *   sips --resampleWidth 1800 -s format png assets-source/logo/WT_Logo.ai \
 *     --out assets-source/logo/monogram.png   (file .ai thực chất là PDF)
 *   node scripts/logo.mjs
 *
 * Script cắt sát nét vẽ và xuất WebP có alpha. Site không tô màu logo ở đây:
 * `.logo-mark` trong app/globals.css dùng ảnh làm MẶT NẠ và đổ màu chữ của
 * section lên, nên một file dùng được cho cả nền sáng lẫn nền tối.
 */

import { statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/logo/monogram.png";
const OUT = "public/logo/monogram.webp";

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let [l, t, r, b] = [info.width, info.height, 0, 0];
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 8) {
      if (x < l) l = x;
      if (x > r) r = x;
      if (y < t) t = y;
      if (y > b) b = y;
    }
  }
}
const pad = 8;
const crop = { left: Math.max(0, l - pad), top: Math.max(0, t - pad), width: r - l + 1 + pad * 2, height: b - t + 1 + pad * 2 };
const out = await sharp(SRC).extract(crop).resize({ width: 640 }).webp({ quality: 90, alphaQuality: 100 }).toFile(OUT);
console.log(OUT, `${out.width}×${out.height}`, `${(statSync(OUT).size / 1024).toFixed(0)}KB`);
