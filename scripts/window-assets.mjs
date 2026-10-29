/**
 * Ô cửa sổ của trang "Travel Guide": PNG gốc → WebP dùng thật.
 *
 *   node scripts/window-assets.mjs
 *
 * Khách gửi một tấm duy nhất: hai cánh cửa mở xiên ra ngoài, và một chậu hoa
 * đặt trên bệ cửa. Nền trong suốt, khung 3375×6000.
 *
 * VÌ SAO PHẢI CẮT MỖI CÁNH LÀM BA
 *
 * Cánh cửa vẽ theo phối cảnh: có nắp trên, có nắp dưới, và ba thanh ngang
 * chia ô kính ở giữa. Một tấm như thế chỉ đúng ở MỘT tỉ lệ cao/rộng. Mà
 * section này cao theo chữ — thẻ dài nhất trên điện thoại cao hơn nghìn
 * pixel, trong khi cánh cửa ở bề rộng hiển thị chỉ cao chừng 140px. Kéo giãn
 * cả tấm cho vừa là nắp trên nắp dưới méo hẳn.
 *
 * Lặp phần giữa cũng không xong: ba thanh ngang vẽ tay không đều nhau (nhịp
 * đo được là 742, 629, 694px), ghép đầu này với đầu kia là lộ chỗ nối.
 *
 * Cách làm ở đây: cắt mỗi cánh thành NẮP TRÊN — MỘT Ô KÍNH SẠCH — NẮP DƯỚI.
 * Hai nắp giữ nguyên tỉ lệ, chỉ ô kính giữa giãn theo chiều cao. Ô giữa chọn
 * đúng khoảng giữa hai thanh ngang nên không có thanh nào bị kéo béo ra, và
 * vì cạnh cánh gần như thẳng ở đoạn đó, giãn dọc vẫn giữ nguyên độ xiên.
 *
 * Mốc cắt chọn sao cho chỗ nối khít: nắp trên kết thúc ở đúng chỗ ô giữa bắt
 * đầu, ô giữa kết thúc ở đúng chỗ nắp dưới bắt đầu — mép trong của cánh thu
 * dần (777 → 719px ở cánh trái) nên cắt lệch một chút là thấy gờ.
 *
 * assets-source/ nằm ngoài git — xem scripts/venue-assets.mjs.
 */

import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/window/window.png";
const OUT = "public/window";

/**
 * Mốc cắt đo từ chính file bằng kênh alpha: `left`/`width` là bề ngang cánh,
 * ba mốc `y` chia cánh thành nắp trên / ô kính / nắp dưới.
 */
const LEAVES = [
  { name: "left", left: 245, width: 545, top: 1080, mid: 2958, low: 3459, end: 4519 },
  { name: "right", left: 2705, width: 415, top: 1060, mid: 3003, low: 3467, end: 4497 },
];

/** Chậu hoa trên bệ cửa — một mảnh rời, đặt đè lên mép dưới ô cửa. */
const PLANT = { left: 1590, top: 3640, width: 1160, height: 930 };

/* Cánh rộng nhất khoảng 4.5rem trên desktop; 240px đủ cho màn 3x. */
const LEAF_WIDTH = 240;
const PLANT_WIDTH = 440;

mkdirSync(OUT, { recursive: true });

let total = 0;

async function cut(name, box, width) {
  const file = `${OUT}/${name}.webp`;
  await sharp(SRC)
    .extract(box)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6, alphaQuality: 92 })
    .toFile(file);

  const { width: w, height: h } = await sharp(file).metadata();
  const size = statSync(file).size;
  total += size;
  console.log(`${name.padEnd(18)} ${w}×${h}  ${Math.round(size / 1024)}KB`);
  return { w, h };
}

for (const leaf of LEAVES) {
  const box = (top, height) => ({ left: leaf.left, top, width: leaf.width, height });

  await cut(`leaf-${leaf.name}-top`, box(leaf.top, leaf.mid - leaf.top), LEAF_WIDTH);
  await cut(`leaf-${leaf.name}-mid`, box(leaf.mid, leaf.low - leaf.mid), LEAF_WIDTH);
  await cut(`leaf-${leaf.name}-bottom`, box(leaf.low, leaf.end - leaf.low), LEAF_WIDTH);
}

await cut("plant", PLANT, PLANT_WIDTH);

console.log(`\nTổng: ${(total / 1024).toFixed(0)}KB`);
