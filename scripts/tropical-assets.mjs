/**
 * Bộ hoạ tiết nhiệt đới của màn mở thiệp: PNG gốc → WebP dùng thật.
 *
 *   node scripts/tropical-assets.mjs
 *
 * Khách gửi 20 lớp PNG vẽ tay, mỗi lớp là một vật nằm lọt trong khung 9:16
 * 3375×6000 (~108MB cả bộ). Script cắt sát viền trong suốt, co về đúng cỡ
 * hiển thị rồi xuất WebP sang public/tropical (~1.5MB cho cả màn).
 *
 * assets-source/ nằm ngoài git (xem .gitignore). Mất thư mục đó thì xin lại
 * bộ PNG của khách rồi chạy lại script này.
 *
 * KHÔNG để trong public/brand: `npm run assets` xoá sạch thư mục đó rồi dựng
 * lại từ brand/ trước mỗi lần build. Đây là cảnh ghép bespoke của một khách,
 * giống public/garden, không đi qua đường ống ấy.
 */

import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/tropical";
const OUT = "public/tropical";

/**
 * Khách đặt tên file theo số thứ tự lớp trong Canva. Đổi sang tên gọi được
 * thì placement trong TropicalCanopy mới đọc ra nghĩa.
 *
 * `big` cho những lớp trải rộng gần kín khung — chúng cần nhiều điểm ảnh hơn
 * một bông hoa nằm ở mép.
 */
const PIECES = [
  { file: "13", name: "fern-frond", big: true },
  { file: "15", name: "agave", big: true },
  { file: "22", name: "banana-leaf", big: true },
  { file: "9", name: "leaf-sprigs" },
  { file: "26", name: "caladium-purple" },
  { file: "27", name: "caladium-pink" },
  { file: "25", name: "hibiscus" },
  { file: "19", name: "heliconia" },
  { file: "16", name: "anthurium" },
  { file: "12", name: "frangipani-branch" },
  { file: "24", name: "frangipani-pair" },
  { file: "23", name: "frangipani" },
  { file: "20", name: "mango" },
  { file: "21", name: "pineapple" },
  { file: "10", name: "papaya" },
  { file: "14", name: "pear" },
  { file: "11", name: "grapes" },
  { file: "17", name: "pomegranate-half" },
  { file: "18", name: "pomegranate" },
  { file: "layer", name: "oval", big: true },
];

mkdirSync(OUT, { recursive: true });

let total = 0;

for (const piece of PIECES) {
  const max = piece.big ? 1100 : 720;

  /* Mỗi PNG là một vật nhỏ nằm giữa khung 3375×6000 toàn trong suốt. Cắt sát
     viền trước, nếu không thì 90% điểm ảnh xuất ra là khoảng trống và mọi
     toạ độ trong TropicalCanopy sẽ phải tính theo khung gốc. */
  const trimmed = await sharp(`${SRC}/${piece.file}.png`).trim({ threshold: 10 }).toBuffer();

  const info = await sharp(trimmed)
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(`${OUT}/${piece.name}.webp`);

  const size = statSync(`${OUT}/${piece.name}.webp`).size;
  total += size;
  console.log(`${piece.name.padEnd(18)} ${String(info.width).padStart(4)}×${info.height}  ${Math.round(size / 1024)}KB`);
}

console.log(`\nTổng: ${(total / 1024 / 1024).toFixed(2)}MB`);
