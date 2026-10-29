/**
 * Bộ tranh của trang "Visa Guide": file gốc khách gửi → WebP trong brand/.
 *
 *   node scripts/visa-assets.mjs
 *
 * Ba thứ, hai nhóm:
 *
 *   stripe-vermilion  dải sọc đỏ–kem, nền của cả section (brand/backgrounds)
 *   paper-beige       giấy beige phẳng, tấm thẻ chữ nằm trên nền sọc
 *   flag-*            sáu lá cờ vẽ tay, một lá cho mỗi nhóm hộ chiếu
 *                     (brand/elements)
 *
 * Vì sao phải qua script chứ không thả thẳng vào brand/: `npm run assets`
 * CHỈ chép file và đọc kích thước, nó không nén gì cả. Bộ gốc nặng 30MB —
 * riêng sáu lá cờ đã 16MB — nên thả thẳng là site cõng từng ấy byte.
 *
 * `inset` của mỗi lá cờ là phần trăm cắt bỏ bốn mép. Ảnh gốc là lá cờ vẽ nằm
 * giữa một quầng tối loang ra bốn phía; giữ nguyên thì trên nền giấy beige
 * mỗi lá thành một ô chữ nhật xám nhoè. Cắt sát mép vải thì sáu lá đứng cạnh
 * nhau mới thành một hàng gọn.
 *
 * assets-source/ nằm ngoài git, như bộ tranh venue và papers.
 */

import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/visa";

/* 1200px là bề rộng chung của mọi ảnh nền trong repo — xem paper-assets.mjs. */
const BACKGROUND_WIDTH = 1200;

/* Cờ hiển thị rộng nhất khoảng 6rem, 320px đủ cho màn 3x. */
const FLAG_WIDTH = 320;

const BACKGROUNDS = [{ file: "beige.png", name: "paper-beige" }];

/**
 * Hai dải sọc không đi đường `backgrounds` mà đi đường `textures`: nền
 * full-bleed bị `object-cover` kéo giãn theo chiều cao section, mà hai
 * section này cao gấp mấy lần bề ngang nên sọc phình ra thành vài vạch to
 * tướng. Là texture thì nó lặp theo chiều ngang và giữ đúng bề rộng vạch ở
 * mọi khổ màn (xem `textureWidth` trong content/client.ts).
 *
 * Ô lặp cắt từ TÂM một vạch màu tới tâm vạch màu kế tiếp — đúng một nhịp.
 * Hai điều kiện, cả hai đều quan trọng:
 *
 * Cắt theo TÂM chứ không theo mép: SectionWrapper lặp ô này bằng `round`,
 * trình duyệt co ô cho vừa chẵn số lần, nên mép trái và mép phải section lúc
 * nào cũng là nửa vạch MÀU — không bao giờ là vạch kem. Cắt theo mép vạch thì
 * một bên sẽ hở ra dải kem dính liền vào tờ giấy beige bên trong, nhìn như
 * tờ giấy loang ra tới mép màn.
 *
 * Chỉ MỘT nhịp một ô: vì `round` luôn xếp chẵn số ô, tổng số nhịp trên màn
 * là bội số của số nhịp trong ô — ô càng nhiều nhịp thì càng ít cách chia.
 * Ô sáu nhịp thì điện thoại ít nhất đã sáu nhịp (vạch hơn 30px, dải lề cạnh
 * tờ giấy rơi trúng vạch kem); ô hai nhịp chỉ chọn được 4 hoặc 8 vạch, không
 * có nấc ở giữa. Ô một nhịp chia được mọi số, nên `textureWidth` muốn vạch
 * rộng bao nhiêu cũng chiều được. Đánh đổi: nét vẽ tay lặp lại sau mỗi vạch,
 * nhưng hai tấm sọc này đều tay và vân giấy mịn nên không nhận ra.
 *
 * Hai mốc dưới đây đo từ chính file (tâm vạch màu ở x = 31, 164, 292, 420,
 * 538, 659, 782…), và hai tấm sọc khách gửi có cùng một nhịp vạch.
 */
const STRIPE_LEFT = 31;
const STRIPE_RIGHT = 164;

const STRIPES = [
  { file: "mix2.png", name: "stripe-vermilion" },
  { file: "mix-olive.png", name: "stripe-olive" },
];

/** [file, tên dùng trong content, phần trăm cắt bốn mép] */
const FLAGS = [
  { file: "flag1.png", name: "flag-eu", inset: { x: 0.05, y: 0.08 } },
  { file: "flag2.png", name: "flag-hongkong", inset: { x: 0.05, y: 0.08 } },
  { file: "flag3.png", name: "flag-asean", inset: { x: 0.05, y: 0.08 } },
  { file: "flag4.png", name: "flag-india", inset: { x: 0.05, y: 0.08 } },
  { file: "flag5.png", name: "flag-maldives", inset: { x: 0.05, y: 0.08 } },
  /* Lá cờ Mỹ nền trong suốt chứ không có quầng tối, và nó phủ gần kín khung
     nên chỉ cắt mép rất mỏng. */
  { file: "flag6.png", name: "flag-usa", inset: { x: 0.035, y: 0.05 } },
];

mkdirSync("brand/backgrounds", { recursive: true });
mkdirSync("brand/elements", { recursive: true });
mkdirSync("brand/textures", { recursive: true });

for (const { file, name } of BACKGROUNDS) {
  const out = `brand/backgrounds/${name}.webp`;
  await sharp(`${SRC}/${file}`)
    .resize({ width: BACKGROUND_WIDTH })
    .webp({ quality: 72, effort: 6 })
    .toFile(out);

  // Màu trung bình — giá trị phải nằm trong `palette` của content/theme.ts để
  // nền section trùng màu tranh lúc ảnh chưa tải xong.
  const pixel = await sharp(out).resize(1, 1).raw().toBuffer();
  const hex = `#${[...pixel.subarray(0, 3)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  console.log(`${name.padEnd(18)} ${hex}  ${(statSync(out).size / 1024).toFixed(0).padStart(4)}KB`);
}

for (const { file, name } of STRIPES) {
  const { height } = await sharp(`${SRC}/${file}`).metadata();
  const out = `brand/textures/${name}.webp`;

  await sharp(`${SRC}/${file}`)
    .extract({
      left: STRIPE_LEFT,
      top: 0,
      width: STRIPE_RIGHT - STRIPE_LEFT,
      height,
    })
    .webp({ quality: 74, effort: 6 })
    .toFile(out);

  const { width: w, height: h } = await sharp(out).metadata();
  console.log(`${name.padEnd(18)} ${w}×${h}  ${(statSync(out).size / 1024).toFixed(0).padStart(4)}KB`);
}

for (const { file, name, inset } of FLAGS) {
  const { width, height } = await sharp(`${SRC}/${file}`).metadata();
  const left = Math.round(width * inset.x);
  const top = Math.round(height * inset.y);

  const out = `brand/elements/${name}.webp`;
  await sharp(`${SRC}/${file}`)
    .extract({ left, top, width: width - left * 2, height: height - top * 2 })
    .resize({ width: FLAG_WIDTH })
    .webp({ quality: 78, effort: 6 })
    .toFile(out);

  console.log(`${name.padEnd(18)} ${(statSync(out).size / 1024).toFixed(0).padStart(4)}KB`);
}
