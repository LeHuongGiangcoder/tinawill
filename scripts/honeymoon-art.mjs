/**
 * Tách nền đen của tranh honeymoon thành nền trong suốt rồi đưa vào brand/.
 *
 *   node scripts/honeymoon-art.mjs && npm run assets
 *
 * Nền của file gốc là đen đặc, không có kênh alpha. Script loang từ bốn cạnh
 * qua các điểm gần đen (nền liền một mảng, còn bình và nho có viền sáng hơn
 * nền nên loang không chui vào trong), làm mềm mép theo độ sáng rồi cắt sát
 * tranh. Đầu vào: assets-source/honeymoon.png (ngoài git).
 */

import sharp from "sharp";

const SRC = "assets-source/honeymoon.png";
const OUT = "brand/elements/honeymoon-jar.webp";
/** Độ sáng (max kênh) dưới T0 là nền đen, trên T1 là tranh đặc. */
const T0 = 14;
const T1 = 40;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const lum = (k) => Math.max(data[k * 4], data[k * 4 + 1], data[k * 4 + 2]);

const bg = new Uint8Array(w * h);
const queue = [];
const seed = (k) => {
  if (!bg[k] && lum(k) < T1) {
    bg[k] = 1;
    queue.push(k);
  }
};
for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
while (queue.length) {
  const k = queue.pop();
  const x = k % w, y = (k / w) | 0;
  if (x > 0) seed(k - 1);
  if (x < w - 1) seed(k + 1);
  if (y > 0) seed(k - w);
  if (y < h - 1) seed(k + w);
}

const out = Buffer.from(data);
let minX = w, minY = h, maxX = 0, maxY = 0;
for (let k = 0; k < w * h; k++) {
  const l = lum(k);
  const a = bg[k] ? Math.round(255 * Math.min(1, Math.max(0, (l - T0) / (T1 - T0)))) : 255;
  out[k * 4 + 3] = a;
  if (a > 8) {
    const x = k % w, y = (k / w) | 0;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
}

const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .extract(box)
  .webp({ quality: 88, alphaQuality: 92 })
  .toFile(OUT);
console.log(`honeymoon-jar ${box.width}×${box.height}`);
