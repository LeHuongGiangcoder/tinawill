/**
 * Ô cửa sổ MỚI của trang "Travel Guide": PNG gốc → WebP dùng thật.
 *
 *   node scripts/travel-window.mjs
 *
 * Khách gửi bốn tấm rời trong public/travel, nền trong suốt, khung 3375×6000:
 *
 *   44.png    khung cửa — đố trên, hai đố dọc, bệ cửa; giữa là lỗ trống
 *   45.png    cánh trái, vẽ lúc đóng
 *   46.png    cánh phải, vẽ lúc đóng
 *   kiss.png  dấu son
 *
 * (43.png là tấm tham chiếu cả ô cửa lúc đóng — không cắt, chỉ để đối chiếu.)
 *
 * VÌ SAO PHẢI CẮT LÀM BA
 *
 * Cùng một lý do như scripts/window-assets.mjs: ô cửa phải cao theo chữ, mà
 * chữ dài ngắn tuỳ thẻ và tuỳ máy. Kéo giãn cả tấm cho vừa thì đố trên và bệ
 * cửa béo ra trông thấy — bệ cửa cao gần 600px trong bản vẽ, giãn 40% là nó
 * dày bằng cả một hàng ô kính.
 *
 * Nên mỗi tấm cắt thành NẮP TRÊN — KHÚC GIỮA — NẮP DƯỚI. Hai nắp giữ nguyên
 * tỉ lệ, chỉ khúc giữa giãn dọc:
 *
 *   • khung:  khúc giữa chỉ còn hai đố dọc, giãn dọc là nó dài ra, không méo
 *   • cánh:   khúc giữa là CẢ BỐN hàng ô kính, nên phần giãn chia đều cho
 *             bốn hàng — mỗi hàng cao thêm một chút, giống hệt một ô cửa cao
 *             hơn ngoài đời. Cắt lấy MỘT hàng rồi giãn thì hàng đó phình to
 *             lệch hẳn với ba hàng kia.
 *
 * Mốc cắt đo từ chính kênh alpha của file: chỗ khung bắt đầu thủng là đáy đố
 * trên, chỗ thôi thủng là đỉnh bệ cửa; với cánh thì là mép trong của hai đố
 * ngang ngoài cùng.
 */

import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "public/travel";
const OUT = "public/window";

/**
 * `left`/`width` là bề ngang tấm, ba mốc `y` chia tấm thành nắp trên / khúc
 * giữa / nắp dưới. Số đo lấy từ kênh alpha của chính file.
 */
const PARTS = [
  // Khung: thủng từ y=1101 tới y=4167 — đó đúng là khoảng hai đố dọc.
  { name: "frame", file: "44.png", left: 171, width: 3052, top: 771, mid: 1101, low: 4167, end: 4766, out: 1400 },
  // Cánh trái: bốn hàng ô kính nằm giữa 1255 và 4007.
  { name: "sash-left", file: "45.png", left: 527, width: 1209, top: 1040, mid: 1255, low: 4007, end: 4228, out: 600 },
  // Cánh phải: hàng ô kính nằm giữa 1238 và 4001.
  { name: "sash-right", file: "46.png", left: 1687, width: 1241, top: 1058, mid: 1238, low: 4001, end: 4241, out: 600 },
];

/** Dấu son — một mảnh rời, bay thẳng về phía người xem lúc cửa mở. */
const KISS = { file: "kiss.png", left: 844, top: 1700, width: 1565, height: 1372, out: 520 };

mkdirSync(OUT, { recursive: true });

let total = 0;

async function cut(name, file, box, width) {
  const out = `${OUT}/${name}.webp`;
  await sharp(`${SRC}/${file}`)
    .extract(box)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6, alphaQuality: 92 })
    .toFile(out);

  const { width: w, height: h } = await sharp(out).metadata();
  const size = statSync(out).size;
  total += size;
  console.log(`${name.padEnd(18)} ${w}×${h}  ${Math.round(size / 1024)}KB`);
}

for (const part of PARTS) {
  const box = (top, height) => ({ left: part.left, top, width: part.width, height });

  await cut(`${part.name}-top`, part.file, box(part.top, part.mid - part.top), part.out);
  await cut(`${part.name}-mid`, part.file, box(part.mid, part.low - part.mid), part.out);
  await cut(`${part.name}-bottom`, part.file, box(part.low, part.end - part.low), part.out);
}

await cut("kiss", KISS.file, KISS, KISS.out);

console.log(`\nTổng: ${(total / 1024).toFixed(0)}KB`);
