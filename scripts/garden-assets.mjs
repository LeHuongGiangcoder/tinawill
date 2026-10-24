/**
 * Bộ asset khu vườn của Tina & Will: PNG gốc → WebP dùng thật.
 *
 *   node scripts/garden-assets.mjs
 *
 * Khách gửi 16 lớp PNG trong assets-source/garden/assets (~33MB). Site không
 * tải được từng đó trên 4G, nên bản dùng thật là WebP đã co về đúng cỡ hiển
 * thị, nằm ở public/garden (~2MB cho cả cảnh).
 *
 * assets-source/ nằm ngoài git (xem .gitignore): 33MB tranh gốc không thuộc
 * về repo. Mất thư mục đó thì giải nén lại bộ khách gửi rồi chạy script này.
 * Giữ PNG gốc vì chúng là bản để vẽ thêm frame nụ/quả non sau này — xem
 * assets-source/garden/ANIMATION-GUIDE.md.
 *
 * KHÔNG để bộ này trong public/brand: `npm run assets` (chạy trước mỗi
 * `npm run build`) xoá sạch public/brand rồi dựng lại từ brand/. Đây là cảnh
 * ghép bespoke của một khách, không đi qua đường ống đó.
 */

import { mkdirSync, readdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/garden/assets";
const OUT = "public/garden";

/** Lớp phủ kín khung cần nhiều điểm ảnh hơn một cụm hoa nằm ở mép. */
const FULL_FRAME = new Set(["water", "foliage-left", "foliage-right", "banana-leaf", "palm-frond"]);

mkdirSync(OUT, { recursive: true });

let total = 0;

for (const file of readdirSync(SRC).filter((f) => f.endsWith(".png"))) {
  const name = file.replace(/\.png$/, "");
  const max = FULL_FRAME.has(name) ? 1200 : 860;

  await sharp(`${SRC}/${file}`)
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 70, effort: 6 })
    .toFile(`${OUT}/${name}.webp`);

  const size = statSync(`${OUT}/${name}.webp`).size;
  total += size;
  console.log(`${name.padEnd(16)} ${Math.round(size / 1024)}KB`);
}

console.log(`\nTổng: ${(total / 1024 / 1024).toFixed(2)}MB`);
