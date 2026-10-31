/**
 * Nét cọ highlight: assets-source/highlight/brush.png → public/highlight/brush.webp.
 *
 *   node scripts/highlight-brush.mjs
 *
 * Khách vẽ nét cọ xanh nhạt trên nền trắng (không có kênh trong suốt). Script
 * đổi độ đậm của nét thành kênh alpha rồi cắt sát, để `.highlight` trong
 * app/globals.css dùng ảnh làm MẶT NẠ và tô bằng màu token — màu highlight
 * đổi theo section chứ không dính cứng màu xanh của file gốc.
 */

import { statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/highlight/brush.png";
const OUT = "public/highlight/brush.webp";
/* Độ đỏ của nét cọ đặc nhất trong file gốc; trắng là 255. */
const INK = 214;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const rgba = Buffer.alloc(w * h * 4, 255);
let [l, t, r, b] = [w, h, 0, 0];
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const a = Math.max(0, Math.min(255, Math.round(((255 - data[i]) / (255 - INK)) * 255)));
    rgba[i + 3] = a;
    if (a > 20) {
      if (x < l) l = x;
      if (x > r) r = x;
      if (y < t) t = y;
      if (y > b) b = y;
    }
  }
}

const out = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
  .extract({ left: l, top: t, width: r - l + 1, height: b - t + 1 })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(OUT);
console.log(OUT, `${out.width}×${out.height}`, `${(statSync(OUT).size / 1024).toFixed(1)}KB`);
