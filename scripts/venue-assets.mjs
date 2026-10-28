/**
 * Cảnh "Our wedding venue" của Tina & Will: PNG gốc → WebP dùng thật.
 *
 *   node scripts/venue-assets.mjs
 *
 * Khách tách năm lớp từ bản Canva, mỗi lớp xuất nguyên khung 3375×6000 với
 * nền trong suốt (~41MB cả bộ). Vì lớp nào cũng đã nằm đúng chỗ trong khung
 * 9/16, web chỉ việc chồng chúng lên nhau — không phải định vị từng cái.
 *
 * assets-source/ nằm ngoài git: 41MB tranh gốc không thuộc về repo. Mất thư
 * mục đó thì xuất lại từ Canva (design "TinaWill", trang 2–6, mỗi trang là
 * một lớp) rồi chạy lại script này.
 *
 * KHÔNG để bộ này trong public/brand: `npm run assets` (chạy trước mỗi
 * `npm run build`) xoá sạch public/brand rồi dựng lại từ brand/. Đây là cảnh
 * ghép bespoke của một khách, không đi qua đường ống đó.
 */

import { mkdirSync, readdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/venue";
const OUT = "public/venue";

/*
  Mọi lớp đều phủ kín khung nên cùng một bề rộng. 1200px đủ cho màn điện
  thoại ở tỉ lệ 3x và cho khung đã cắt kiểu "cover" trên desktop; cao hơn
  nữa chỉ thêm byte chứ mắt không thấy khác.
*/
const WIDTH = 1200;

mkdirSync(OUT, { recursive: true });

let total = 0;

for (const file of readdirSync(SRC).filter((f) => f.endsWith(".png"))) {
  const name = file.replace(/\.png$/, "");

  await sharp(`${SRC}/${file}`)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 70, effort: 6 })
    .toFile(`${OUT}/${name}.webp`);

  const size = statSync(`${OUT}/${name}.webp`).size;
  total += size;
  console.log(`${name.padEnd(16)} ${Math.round(size / 1024)}KB`);
}

console.log(`\nTổng: ${(total / 1024 / 1024).toFixed(2)}MB`);
