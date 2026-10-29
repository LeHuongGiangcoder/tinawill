/**
 * Ô cửa sổ của trang "Travel Guide": PNG gốc → WebP dùng thật.
 *
 *   node scripts/travel-window.mjs
 *
 * Khách gửi hai tấm trong public/travel, nền trong suốt, khung 3375×6000:
 *
 *   travel.png  cửa sổ chớp xanh khép kín trong khung đỏ — MỘT tấm phẳng,
 *               không có lớp nào tách sẵn
 *   kiss.png    dấu son
 *
 * Nên việc đầu tiên là TÁCH tấm đó ra thành khung và cánh cửa:
 *
 *   • khung  = tấm gốc, nhưng chỗ hai cánh đứng được đục thủng
 *   • cánh   = một cánh trái cắt ra nguyên vẹn; cánh phải là chính nó lật
 *              gương (hai cánh vẽ cùng một kiểu, chỉ đối xứng)
 *
 * Mốc cắt đo từ chính file: cánh nằm trọn trong x 560→2826, y 1148→4440, vết
 * khép giữa hai cánh ở x≈1697, và khoảng thủng của khung khớp đúng khoảng đó.
 *
 * VÌ SAO MỖI MẢNH LẠI CẮT LÀM BA
 *
 * Ô cửa phải cao theo chữ, mà chữ dài ngắn tuỳ thẻ và tuỳ máy. Kéo giãn cả
 * tấm cho vừa thì viền khung béo ra, tấm đỏ hình thoi ở chân cánh méo đi.
 * Nên mỗi mảnh cắt thành NẮP TRÊN — KHÚC GIỮA — NẮP DƯỚI; hai nắp giữ nguyên
 * tỉ lệ, chỉ khúc giữa giãn dọc:
 *
 *   • khung:  khúc giữa chỉ còn hai trụ dọc, giãn dọc là nó dài ra, không méo
 *   • cánh:   khúc giữa là các thanh lam. Lam cách nhau đều đặn (khoảng 145px),
 *             nên mốc cắt đặt đúng vào KHE TỐI giữa hai thanh lam — chỗ nối
 *             nằm trong bóng nên không lộ. Hai nắp giữ lại vài thanh lam ở hai
 *             đầu để cánh vẫn trông là cánh chớp khi khúc giữa bị nén.
 *
 * assets-source/ nằm ngoài git — xem scripts/venue-assets.mjs.
 */

import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "public/travel";
const OUT = "public/window";

/** Khung: bao ngoài và phần đục thủng cho hai cánh. */
const FRAME = { left: 240, top: 747, width: 2912, bottom: 4804 };
/** Đáy đố trên và đỉnh bệ dưới — cũng là chiều cao của chỗ thủng. */
const OPENING = { top: 1148, bottom: 4440, left: 562, right: 2826 };

/**
 * Cánh trái. `top`/`mid`/`low`/`end` là bốn mốc y chia cánh thành nắp trên /
 * khúc giữa / nắp dưới; `mid` và `low` đặt vào khe tối giữa hai thanh lam.
 */
const LEAF = { left: 556, width: 1141, top: 1138, mid: 1719, low: 2874, end: 4446 };

/** Dấu son — một mảnh rời, bay thẳng về phía người xem lúc cửa mở. */
const KISS = { file: "kiss.png", left: 844, top: 1700, width: 1565, height: 1372, out: 520 };

const FRAME_WIDTH = 1400;
const LEAF_WIDTH = 640;

mkdirSync(OUT, { recursive: true });

let total = 0;

async function save(pipeline, name, width) {
  const out = `${OUT}/${name}.webp`;
  await pipeline
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6, alphaQuality: 92 })
    .toFile(out);

  const { width: w, height: h } = await sharp(out).metadata();
  const size = statSync(out).size;
  total += size;
  console.log(`${name.padEnd(14)} ${w}×${h}  ${Math.round(size / 1024)}KB`);
}

/* ---- khung: tấm gốc đã đục thủng chỗ hai cánh đứng ----------------------- */

const { data, info } = await sharp(`${SRC}/travel.png`)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let y = OPENING.top + 4; y < OPENING.bottom - 4; y++) {
  for (let x = OPENING.left; x < OPENING.right; x++) {
    data[(y * info.width + x) * info.channels + 3] = 0;
  }
}

const framed = () =>
  sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: info.channels },
  });

const frameBox = (top, bottom) => ({
  left: FRAME.left,
  top,
  width: FRAME.width,
  height: bottom - top,
});

await save(framed().extract(frameBox(FRAME.top, OPENING.top)), "shutter-frame-top", FRAME_WIDTH);
await save(framed().extract(frameBox(OPENING.top, OPENING.bottom)), "shutter-frame-mid", FRAME_WIDTH);
await save(framed().extract(frameBox(OPENING.bottom, FRAME.bottom)), "shutter-frame-bottom", FRAME_WIDTH);

/* ---- cánh trái: lấy từ tấm gốc, KHÔNG đục thủng -------------------------- */

const leafBox = (top, bottom) => ({
  left: LEAF.left,
  top,
  width: LEAF.width,
  height: bottom - top,
});

const source = () => sharp(`${SRC}/travel.png`);

await save(source().extract(leafBox(LEAF.top, LEAF.mid)), "shutter-leaf-top", LEAF_WIDTH);
await save(source().extract(leafBox(LEAF.mid, LEAF.low)), "shutter-leaf-mid", LEAF_WIDTH);
await save(source().extract(leafBox(LEAF.low, LEAF.end)), "shutter-leaf-bottom", LEAF_WIDTH);

await save(
  sharp(`${SRC}/${KISS.file}`).extract({
    left: KISS.left,
    top: KISS.top,
    width: KISS.width,
    height: KISS.height,
  }),
  "kiss",
  KISS.out,
);

console.log(`\nTổng: ${(total / 1024).toFixed(0)}KB`);
