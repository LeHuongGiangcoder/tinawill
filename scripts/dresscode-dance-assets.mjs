/**
 * Cặp đôi khiêu vũ của trang "Dresscode": PNG gốc → WebP dùng thật.
 *
 *   node scripts/dresscode-dance-assets.mjs
 *
 * Bộ gốc (assets-source/dresscode-dance/) có sáu bản cùng một dáng, cùng toạ
 * độ: bản gốc trắng ngà + than chì và năm bản đã nhuộm váy/vest theo năm màu
 * của moodboard. Canvas WebGL (lib/dance.ts) uốn chung một lưới cho hai bản
 * kề nhau rồi quét màu từ tà váy lên, nên các file PHẢI giữ nguyên khung và
 * kích thước như nhau — script chỉ thu nhỏ và nén, không cắt.
 *
 * 1199px gốc → 900px: khung hiển thị lớn nhất chỉ ~420px CSS, 900px đủ cho màn
 * 2x. Sáu PNG 1,5MB thành sáu WebP ~100KB.
 *
 * assets-source/ nằm ngoài git — xem scripts/venue-assets.mjs.
 */

import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/dresscode-dance/assets";
const OUT = "public/dresscode/dance";
const WIDTH = 900;
const LOOKS = ["original", "ruby", "vermilion", "tangerine", "olive", "dark-olive"];

mkdirSync(OUT, { recursive: true });

for (const id of LOOKS) {
  const out = `${OUT}/couple-${id}.webp`;
  await sharp(`${SRC}/couple-${id}.png`)
    .resize({ width: WIDTH })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(out);
  console.log(`${out}  ${(statSync(out).size / 1024).toFixed(0)} KB`);
}
