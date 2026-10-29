/**
 * Lớp lá của cảnh "Save the date": foliage.png → mỗi tán lá một file WebP.
 *
 *   node scripts/time-foliage.mjs
 *
 * Khách xuất lá thành MỘT lớp phủ kín khung, nên cả bốn góc lá dính nhau
 * trong một file — muốn gió thổi tán này mà không kéo theo tán kia thì phải
 * tách ra. Lá vẽ rời nhau trên nền trong suốt, nên không phải cắt tay: script
 * gán nhãn các vùng điểm ảnh dính liền (connected components) rồi xuất mỗi
 * vùng thành một file, cắt sát nét vẽ.
 *
 * Hai điểm quan trọng khi cắt:
 *
 *   • Cắt theo nhãn chứ không theo khung chữ nhật. Khung của tán lá trái dưới
 *     chồng lên khung của tàu cọ ngay trên nó, nên cắt chữ nhật là mỗi file
 *     dính một mẩu của tán bên cạnh — rồi khi hai tán đung đưa lệch pha, mẩu
 *     thừa đó trượt khỏi tán gốc thành một vệt lá ma.
 *
 *   • Vùng nhỏ hơn `MIN_PX` nhập vào tán gần nhất. Vài đầu lá tách rời khỏi
 *     cuống trong bản vẽ; để nó thành lớp riêng thì nó đứng yên trong khi
 *     cuống của chính nó đung đưa.
 *
 * Script in ra bảng vị trí (phần trăm của khung 1200×2133) — chép vào mảng
 * `FRONDS` trong components/sections/Time.tsx. Chạy lại script thì chép số
 * mới, đừng sửa tay.
 *
 * assets-source/ nằm ngoài git — xem scripts/time-assets.mjs.
 */

import { mkdirSync, statSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/time/foliage.png";
const OUT = "public/time";

/* Cùng bề rộng với các lớp khác của cảnh — xem scripts/time-assets.mjs. */
const WIDTH = 1200;

/** Dưới ngưỡng này là mẩu lá rơi, nhập vào tán gần nhất. */
const MIN_PX = 2000;

/** Điểm ảnh mờ hơn mức này coi như nền — viền chống răng cưa của nét vẽ. */
const ALPHA = 16;

/**
 * Tên của từng tán, tra theo chỗ nó nằm trong khung. Script tự gán nhãn nên
 * thứ tự vùng có thể đổi giữa hai lần chạy; tra theo TÂM vùng thì tên luôn
 * dính đúng tán, và file sinh ra không đổi tên sau mỗi lần xuất lại ảnh.
 */
const NAMES = [
  { name: "branch-top", x: [0, 50], y: [0, 35] },
  { name: "frond-left", x: [0, 30], y: [35, 50] },
  { name: "leaves-left", x: [0, 50], y: [50, 100] },
  { name: "palm-right-top", x: [50, 100], y: [55, 72] },
  { name: "palm-right-bottom", x: [50, 100], y: [72, 85] },
  { name: "leaves-bottom", x: [40, 100], y: [85, 100] },
];

const { data, info } = await sharp(SRC)
  .resize({ width: WIDTH })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: w, height: h } = info;

/* Gán nhãn vùng dính liền, 8 hướng — lá vẽ bằng nét cọ nên hai nhánh của cùng
   một cành có khi chỉ chạm nhau ở một góc điểm ảnh. */
const label = new Int32Array(w * h).fill(-1);
const regions = [];
const stack = [];

for (let seed = 0; seed < w * h; seed++) {
  if (label[seed] !== -1 || data[seed * 4 + 3] <= ALPHA) continue;

  const id = regions.length;
  const region = { id, n: 0, minX: w, maxX: -1, minY: h, maxY: -1 };
  regions.push(region);

  label[seed] = id;
  stack.push(seed);

  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    const y = (p / w) | 0;

    region.n++;
    if (x < region.minX) region.minX = x;
    if (x > region.maxX) region.maxX = x;
    if (y < region.minY) region.minY = y;
    if (y > region.maxY) region.maxY = y;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const q = ny * w + nx;
        if (label[q] === -1 && data[q * 4 + 3] > ALPHA) {
          label[q] = id;
          stack.push(q);
        }
      }
    }
  }
}

const centre = (r) => ({ x: ((r.minX + r.maxX) / 2 / w) * 100, y: ((r.minY + r.maxY) / 2 / h) * 100 });

const keep = regions.filter((r) => r.n >= MIN_PX);
const crumbs = regions.filter((r) => r.n < MIN_PX);

/* Mẩu rơi về tán gần nhất: đo từ tâm mẩu tới tâm tán, theo phần trăm khung. */
const owner = new Int32Array(regions.length);
for (const r of regions) owner[r.id] = r.id;

for (const crumb of crumbs) {
  const c = centre(crumb);
  let best = keep[0];
  let bestD = Infinity;
  for (const r of keep) {
    const k = centre(r);
    const d = (c.x - k.x) ** 2 + (c.y - k.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = r;
    }
  }
  owner[crumb.id] = best.id;
  best.minX = Math.min(best.minX, crumb.minX);
  best.maxX = Math.max(best.maxX, crumb.maxX);
  best.minY = Math.min(best.minY, crumb.minY);
  best.maxY = Math.max(best.maxY, crumb.maxY);
}

mkdirSync(OUT, { recursive: true });

const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`;
const rows = [];
let total = 0;

for (const region of keep) {
  const c = centre(region);
  const named = NAMES.find(
    (n) => c.x >= n.x[0] && c.x < n.x[1] && c.y >= n.y[0] && c.y < n.y[1],
  );
  const name = named?.name ?? `frond-${region.id}`;

  const bw = region.maxX - region.minX + 1;
  const bh = region.maxY - region.minY + 1;

  /* Chép từng điểm ảnh của RIÊNG vùng này — xem chú thích đầu file. */
  const out = Buffer.alloc(bw * bh * 4);
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const src = (y + region.minY) * w + (x + region.minX);
      if (owner[label[src]] !== region.id) continue;
      out.set(data.subarray(src * 4, src * 4 + 4), (y * bw + x) * 4);
    }
  }

  const file = `${OUT}/foliage-${name}.webp`;
  await sharp(out, { raw: { width: bw, height: bh, channels: 4 } })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(file);

  total += statSync(file).size;
  rows.push(
    `  { name: "${name}", at: { left: "${pct(region.minX, w)}", top: "${pct(region.minY, h)}", width: "${pct(bw, w)}", height: "${pct(bh, h)}" } },`,
  );
}

console.log(`${keep.length} tán, ${crumbs.length} mẩu rơi đã nhập, ${(total / 1024).toFixed(0)}KB\n`);
console.log("Chép vào FRONDS trong components/sections/Time.tsx:\n");
console.log(rows.join("\n"));
