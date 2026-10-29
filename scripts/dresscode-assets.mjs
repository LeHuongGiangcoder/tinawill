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

/**
 * Vệt sơn làm ô màu trong bảng dresscode.
 *
 * Khách gửi MỘT vệt, màu xanh bạc hà nhạt. Sáu ô màu không phải sáu file:
 * file này xuất ra bản XÁM của vệt, rồi CSS tô màu lên (xem `.swatch` trong
 * app/globals.css) — mã màu vẫn nằm một chỗ duy nhất trong content/client.ts,
 * đổi một mã là ô đổi theo, không phải chạy lại script.
 *
 * `SWATCH_GAIN` kéo giãn tương phản quanh mức xám giữa. Ảnh gốc sáng đều
 * (L trung bình 200/255, dao động 147–253), mà `mix-blend-mode: soft-light`
 * lấy 128 làm mức "không đổi gì": để nguyên thì ô nào cũng bị kéo sáng lên.
 * Dời tâm về 128 rồi nhân hệ số thì chỉ còn lại nét cọ, không còn sắc sáng
 * của bản gốc.
 */
const SWATCH = { file: "swatch-shape.png", name: "swatch-shape" };
const SWATCH_MEAN = 200;
const SWATCH_GAIN = 0.8;
/* Ô màu rộng nhất khoảng 7rem; 480px đủ cho màn 3x. */
const SWATCH_WIDTH = 480;

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

{
  const src = `${SRC}/${SWATCH.file}`;
  const { width, height, channels } = await sharp(src).metadata();
  const { data } = await sharp(src).raw().toBuffer({ resolveWithObject: true });

  /* Xám hoá rồi dời tâm về 128 — giữ nguyên kênh alpha để vệt vẫn là vệt. */
  const out = Buffer.alloc(width * height * 2);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    out[i * 2] = Math.max(0, Math.min(255, Math.round(128 + (luma - SWATCH_MEAN) * SWATCH_GAIN)));
    out[i * 2 + 1] = data[i * channels + 3];
  }

  const file = `${OUT}/${SWATCH.name}.webp`;
  await sharp(out, { raw: { width, height, channels: 2 } })
    .trim()
    .resize({ width: SWATCH_WIDTH })
    .webp({ quality: 80, effort: 6, alphaQuality: 90 })
    .toFile(file);

  const meta = await sharp(file).metadata();
  console.log(
    `${SWATCH.name.padEnd(10)} ${meta.width}×${meta.height}  ${Math.round(statSync(file).size / 1024)}KB`,
  );
}
