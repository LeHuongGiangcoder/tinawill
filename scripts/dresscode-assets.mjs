/**
 * Dải bãi biển của trang "Dresscode": PNG gốc → WebP dùng thật.
 *
 *   node scripts/dresscode-assets.mjs
 *
 * Khác hai cảnh Venue và Save the date, trang này KHÔNG phải cảnh ghép: nội
 * dung (bảng màu, sáu khối gợi ý gập mở) dài ngắn tuỳ khách nên section phải
 * cao theo chữ, không khoá được vào khung 9/16.
 *
 * Vì vậy chỉ lấy đúng phần tranh dùng được: dải dù sọc + bãi cát nằm ở đáy
 * khung gốc (từ y 4350/6000 xuống hết), cắt ra thành một dải ngang đặt ở chân
 * section. Nền cam và chữ "Dresscode" trong bản gốc không cần cắt: nền đã là
 * giấy cam `paper-mango` của site, còn tiêu đề là chữ thật.
 *
 * assets-source/ nằm ngoài git — xem scripts/venue-assets.mjs.
 */

import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/dresscode";
const OUT = "public/dresscode";

/** Khung gốc của bản Canva. */
const FRAME = { w: 3375, h: 6000 };

/* Mép trên của dải: đo bằng kênh alpha của chính file (pixel đục đầu tiên ở
   y 4400), lùi lên 50px cho chắc chắn không cắt cụt chóp dù nào. */
const BAND_TOP = 4350;

/* Dải nằm ngang nên 1600px là đủ cho màn rộng ở tỉ lệ 2x. */
const WIDTH = 1600;

mkdirSync(OUT, { recursive: true });

await sharp(`${SRC}/umbrellas.png`)
  .extract({ left: 0, top: BAND_TOP, width: FRAME.w, height: FRAME.h - BAND_TOP })
  .resize({ width: WIDTH, withoutEnlargement: true })
  .webp({ quality: 72, effort: 6 })
  .toFile(`${OUT}/umbrellas.webp`);

const { width, height } = await sharp(`${OUT}/umbrellas.webp`).metadata();
console.log(`umbrellas ${width}×${height}  ${Math.round(statSync(`${OUT}/umbrellas.webp`).size / 1024)}KB`);
