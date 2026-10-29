/**
 * Hai cánh tay cụng ly của trang Venue: hands.png → hai WebP, mỗi cánh một file.
 *
 *   node scripts/venue-arms.mjs
 *
 * Khách gửi `assets-source/venue/hands.png` (1774×887, nền trong suốt): cả hai
 * cánh tay vẽ TRỌN từ ống tay áo tới ly. Lớp `toast` cũ là một khung 1200×2133
 * bị cắt ở mép khung — ống tay áo cụt ngay mép — nên khi tay vươn vào cụng ly
 * thì chỗ cụt lộ ra. Bản này dài quá mép khung, nên tay đi vào bao nhiêu thì
 * phần tay phía sau cứ thế trượt ra, không bao giờ lộ đầu cụt (khung 9/16 của
 * Venue cắt phần thừa — xem components/sections/Venue.tsx).
 *
 * Hai cánh không chạm nhau (hở ~180px giữa bàn tay phải và ly trái), nên cắt
 * thẳng một đường dọc ở x = 917. Mỗi nửa còn được cắt sát nét vẽ — chỉ giữ
 * vùng có điểm ảnh — và script in ra vị trí đặt nó trong khung 1200×2133.
 *
 * Vị trí đặt: cùng cỡ với lớp toast cũ (chiều cao cánh trái đo ra 518px ở cả
 * hai bản, nên tỉ lệ 1:1), và tâm của hai ly trùng tâm của hai ly cũ — nên
 * đứng yên thì cụm tay nằm đúng chỗ bản vẽ đã dành cho nó.
 */

import { statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/venue/hands.png";
const OUT = "public/venue";
const SPLIT = 917;

/** Khung của cảnh Venue, và toạ độ đặt hands.png trong khung đó. */
const FRAME = { w: 1200, h: 2133 };
const OFFSET = { x: -327.5, y: 1113.5 };

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;

for (const [side, x0, x1] of [
  ["left", 0, SPLIT],
  ["right", SPLIT, w],
]) {
  let minX = w, maxX = -1, minY = h, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = x0; x < x1; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  await sharp(SRC)
    .extract({ left: x0, top: 0, width: x1 - x0, height: h })
    .extract(box.left >= x0 ? { ...box, left: box.left - x0 } : box)
    .webp({ quality: 88, alphaQuality: 90, effort: 6 })
    .toFile(`${OUT}/arm-${side}.webp`);

  const kb = Math.round(statSync(`${OUT}/arm-${side}.webp`).size / 1024);
  const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`;
  console.log(
    `${side.padEnd(5)} ${kb}KB  left ${pct(box.left + OFFSET.x, FRAME.w)}  top ${pct(box.top + OFFSET.y, FRAME.h)}  width ${pct(box.width, FRAME.w)}  height ${pct(box.height, FRAME.h)}`,
  );
}
