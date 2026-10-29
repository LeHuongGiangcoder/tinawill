/**
 * Bốn tờ giấy màu của Tina & Will: file gốc khách gửi → WebP trong brand/.
 *
 *   node scripts/paper-assets.mjs
 *
 * Khách gửi bốn tờ giấy màu phẳng có vân (ô liu, rượu vang, đỏ son, cam), mỗi
 * tờ một ảnh dọc 2–2.4MB. Script này đưa chúng về 1200px, nén WebP, và đặt
 * vào brand/backgrounds để `npm run assets` kê vào content/assets.ts.
 *
 * `darken` là chỗ đáng chú ý. Hai tờ đỏ son và cam ở sắc nguyên bản quá sáng
 * để làm nền chữ: chữ kem trên #e32b03 chỉ đạt 4.2:1 và trên #fc6102 là
 * 2.9:1 — dưới ngưỡng AA, và ngoài nắng thì chữ biến mất. Cách xử lý là hạ
 * sắc ngay trong file (nhân tuyến tính 0.73 và 0.64) chứ KHÔNG phủ `overlay`
 * lên section: giấy giữ nguyên hạt vân, và màu nền section trùng đúng màu
 * file nên lúc ảnh chưa tải xong khách không thấy loé một mảng màu khác.
 *
 * Sau khi đổi hệ số ở đây thì phải đo lại màu trung bình (script in ra) và
 * cập nhật `palette.wine|vermilion|mango` trong content/theme.ts — hai con số
 * đó phải khớp nhau.
 *
 * assets-source/ nằm ngoài git, như bộ tranh venue và garden.
 */

import { statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/papers";
const OUT = "brand/backgrounds";

/*
  1200px là bề rộng chung của mọi ảnh nền trong repo: đủ cho màn điện thoại ở
  tỉ lệ 3x, và vì đây là màu phẳng có vân nên to hơn nữa chỉ thêm byte.
*/
const WIDTH = 1200;

/** `darken`: hệ số nhân tuyến tính, 1 là giữ nguyên sắc khách gửi. */
const PAPERS = [
  { file: "back1.webp", name: "paper-olive", darken: 1 },
  { file: "back2.png", name: "paper-wine", darken: 1 },
  { file: "back3.png", name: "paper-vermilion", darken: 0.73 },
  { file: "back4.png", name: "paper-mango", darken: 0.64 },
];

for (const { file, name, darken } of PAPERS) {
  let img = sharp(`${SRC}/${file}`).resize({ width: WIDTH });
  if (darken !== 1) img = img.linear(darken, 0);

  await img.webp({ quality: 72, effort: 6 }).toFile(`${OUT}/${name}.webp`);

  // Màu trung bình của file vừa xuất — chính là giá trị phải nằm trong
  // `palette` của content/theme.ts để nền section trùng màu giấy.
  const pixel = await sharp(`${OUT}/${name}.webp`).resize(1, 1).raw().toBuffer();
  const hex = `#${[...pixel.subarray(0, 3)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  const kb = (statSync(`${OUT}/${name}.webp`).size / 1024).toFixed(0);

  console.log(`${name.padEnd(16)} ${hex}  ${kb.padStart(4)}KB`);
}
