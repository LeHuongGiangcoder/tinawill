/**
 * Chiếc xe chạy trên đường kẻ trang Visa: assets-source/visa/car.png → public/visa/car.webp.
 *
 *   node scripts/visa-car.mjs
 *
 * Khách xuất xe nguyên khung 3375×6000 nền trong suốt; script cắt sát nét vẽ
 * để `.getBoundingClientRect()` của xe là thân xe thật chứ không phải một
 * khung giấy trống, rồi in cỡ để chép vào components/sections/Visa.tsx.
 */

import { statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/visa/car.png";
const OUT = "public/visa/car.webp";
const WIDTH = 480;

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

const crop = { left: l, top: t, width: r - l + 1, height: b - t + 1 };
const height = Math.round((WIDTH * crop.height) / crop.width);
await sharp(SRC).extract(crop).resize(WIDTH, height).webp({ quality: 85 }).toFile(OUT);
console.log(`${OUT} ${WIDTH}×${height} ${(statSync(OUT).size / 1024).toFixed(0)}KB`);
