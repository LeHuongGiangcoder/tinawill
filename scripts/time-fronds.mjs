/**
 * Lá của cảnh "Save the date": assets-source/time/new1..5.png → public/time.
 *
 *   node scripts/time-fronds.mjs
 *
 * Khác bản cũ (scripts/time-foliage.mjs, cắt từ MỘT lớp phủ kín khung nên mỗi
 * tán bị cụt ở mép khung), năm file new*.png khách gửi là từng tán VẼ TRỌN —
 * cuống và đầu lá đều còn nguyên. Khi tán đung đưa, phần thừa nằm ngoài khung
 * trượt vào thay chỗ, nên không còn lộ mép cắt. `.stage-9x16` clip phần ngoài.
 *
 * Mỗi tán được đặt lại đúng chỗ bản cắt cũ từng đứng: `scale` và `x`/`y` (điểm
 * ảnh của khung 1200×2133, góc trên trái của ảnh) dò bằng cách so mặt nạ alpha
 * của ảnh mới với bản cắt cũ. Bảng in ra ở cuối chép vào `FRONDS` trong
 * components/sections/Time.tsx — chạy lại thì chép số mới, đừng sửa tay.
 */

import { statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/time";
const OUT = "public/time";

const FRAMES = {
  "branch-top": { file: "new1.png", scale: 0.588, x: -222, y: -219 },
  "leaves-left": { file: "new2.png", scale: 0.78, x: -304, y: 972 },
  "frond-left": { file: "new3.png", scale: 0.196, x: -72, y: 828 },
  "palm-right-top": { file: "new4.png", scale: 0.188, x: 936, y: 1323 },
  "palm-right-bottom": { file: "new5.png", scale: 0.158, x: 939, y: 1527 },
};

for (const [name, f] of Object.entries(FRAMES)) {
  const meta = await sharp(`${SRC}/${f.file}`).metadata();
  const w = Math.round(meta.width * f.scale);
  const h = Math.round(meta.height * f.scale);
  /* Xuất ở gấp 1,6 lần cỡ hiển thị trong khung 1200 để màn retina vẫn nét. */
  const out = `${OUT}/foliage-${name}.webp`;
  await sharp(`${SRC}/${f.file}`)
    .resize(Math.round(w * 1.6), Math.round(h * 1.6), { kernel: "lanczos3" })
    .webp({ quality: 80, alphaQuality: 90 })
    .toFile(out);
  console.log(name, JSON.stringify({ x: f.x, y: f.y, w, h }), `${(statSync(out).size / 1024).toFixed(0)}KB`);
}
