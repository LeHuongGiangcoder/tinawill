/**
 * Ba con tem của trang "Agenda": PNG gốc → WebP dùng thật.
 *
 *   node scripts/agenda-assets.mjs
 *
 * Khách gửi cả ba con tem nằm cạnh nhau trong MỘT khung 3375×6000 nền trong
 * suốt. Mỗi con đại diện một ngày của cuối tuần, nên phải cắt rời ra thành ba
 * file: nút chọn ngày nào thì sáng con tem ngày ấy.
 *
 *   cocktail  ly martini, viền ca rô xanh  → tối thứ Sáu
 *   sun       mặt trời cười, viền răng cưa → ngày cưới thứ Bảy
 *   monstera  lá monstera, viền ca rô hồng → brunch Chủ nhật
 *
 * Mốc cắt đo từ chính file: dải tem nằm ở y 1572–2796, còn hai đường nối dọc
 * tìm bằng cách quét màu một hàng ngang — khung vàng của con giữa bắt đầu ở
 * x≈1243 và kết thúc ở x≈2202.
 *
 * assets-source/ nằm ngoài git — xem scripts/venue-assets.mjs.
 */

import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/agenda/stamps.png";
const OUT = "public/agenda";

/** Mép trên / dưới của dải tem trong khung gốc. */
const TOP = 1566;
const BOTTOM = 2802;

/** Ba ô cắt: [tên, x bắt đầu, x kết thúc]. */
const STAMPS = [
  ["cocktail", 152, 1218],
  ["sun", 1222, 2200],
  ["monstera", 2200, 3242],
];

/* Tem hiển thị rộng nhất khoảng 9rem trên desktop, 600px là đủ cho màn 3x. */
const WIDTH = 600;

mkdirSync(OUT, { recursive: true });

for (const [name, left, right] of STAMPS) {
  await sharp(SRC)
    .extract({ left, top: TOP, width: right - left, height: BOTTOM - TOP })
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(`${OUT}/${name}.webp`);

  const { width, height } = await sharp(`${OUT}/${name}.webp`).metadata();
  console.log(
    `${name.padEnd(10)} ${width}×${height}  ${Math.round(statSync(`${OUT}/${name}.webp`).size / 1024)}KB`,
  );
}
