/**
 * Cảnh "Save the date" của Tina & Will: PNG gốc → WebP dùng thật.
 *
 *   node scripts/time-assets.mjs
 *
 * Giống cảnh Venue: khách tách bản Canva thành hai lớp, mỗi lớp xuất nguyên
 * khung 3375×6000 nền trong suốt (~16MB cả bộ). Lớp nào cũng đã nằm đúng chỗ
 * trong khung 9/16 nên web chỉ việc chồng chúng lên nhau.
 *
 *   loungers  hai ghế tắm nắng + hai con mèo — nằm DƯỚI chữ
 *   foliage   lá cây bốn góc — nằm TRÊN chữ, đúng như bản vẽ (nhành lá
 *             góc trái trên liếm qua chữ "S" của "Save")
 *
 * assets-source/ nằm ngoài git. Mất thư mục đó thì xuất lại từ Canva rồi chạy
 * lại script này. Không để bộ này trong public/brand: `npm run assets` xoá
 * sạch thư mục đó trước mỗi build, còn đây là cảnh bespoke của một khách.
 */

import { mkdirSync, readdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/time";
const OUT = "public/time";

/* Hai lớp đều phủ kín khung nên cùng bề rộng — xem scripts/venue-assets.mjs. */
const WIDTH = 1200;

/* Bản ghép đầy đủ chỉ để đối chiếu khi dựng, không lên web. */
const SKIP = new Set(["reference"]);

mkdirSync(OUT, { recursive: true });

let total = 0;

for (const file of readdirSync(SRC).filter((f) => f.endsWith(".png"))) {
  const name = file.replace(/\.png$/, "");
  if (SKIP.has(name)) continue;

  await sharp(`${SRC}/${file}`)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 70, effort: 6 })
    .toFile(`${OUT}/${name}.webp`);

  const size = statSync(`${OUT}/${name}.webp`).size;
  total += size;
  console.log(`${name.padEnd(16)} ${Math.round(size / 1024)}KB`);
}

console.log(`\nTổng: ${(total / 1024 / 1024).toFixed(2)}MB`);
