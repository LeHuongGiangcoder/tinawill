/**
 * Bộ tranh của trang "Our story": ba file gốc khách gửi → WebP.
 *
 *   node scripts/love-story-assets.mjs && npm run assets
 *
 *   paper.png    tờ giấy viền lượn sóng  → public/love-story/paper-{top,mid,bottom}.webp
 *   lanterns.png tờ ảnh 11 đèn lồng      → brand/elements/lantern-01…11
 *   lotus.png    tờ ảnh 9 đèn hoa đăng   → brand/elements/lotus-01…09
 *
 * Mỗi tờ ảnh đèn là một ảnh nền trong suốt chứa nhiều vật rời. Script tách
 * từng vật bằng cách tìm các mảng điểm ảnh có alpha dính liền nhau (sau khi
 * phình ra vài px để dây treo, tua và bóng nước dính về đúng vật của nó),
 * rồi cắt sát và nén lại. Tên đánh số theo thứ tự trái → phải, trên → dưới.
 *
 * assets-source/ nằm ngoài git, như các bộ tranh khác.
 */

import { mkdirSync, rmSync, readdirSync } from "node:fs";

import sharp from "sharp";

const SRC = "assets-source/love-story";
const ELEMENTS = "brand/elements";

/*
 * Cùng MỘT hệ số thu cho cả tờ ảnh, không phải cùng một bề rộng: đèn nhỏ phải
 * ra file nhỏ thì khi hiển thị mới còn nhỏ hơn đèn lớn. Đèn lồng hiển thị rộng
 * nhất ~7rem, nên 0.4 (đèn to nhất ~365px) đủ cho màn 3x.
 */
const LANTERN_SCALE = 0.4;
const LOTUS_SCALE = 1;

/** Phần dây kéo dài thêm phía trên mỗi đèn, để treo từ mép section xuống được. */
const STRING_EXTRA = 1400;
const PAPER_WIDTH = 1080;

mkdirSync(ELEMENTS, { recursive: true });
mkdirSync("public/love-story", { recursive: true });

/* ------------------------------------------------------------ giấy */

/*
 * Tờ giấy cắt làm ba mảnh ngang: nắp trên, nắp dưới, và một dải giữa giãn theo
 * chữ (xem `.page-frame-body` trong app/globals.css). Hai nắp giữ nguyên hai
 * góc bo nên không bị kéo méo; dải giữa chứa nhịp sóng của hai mép bên.
 *
 * Cắt ngang chứ không cắt chín mảnh (`border-image`): cách chín mảnh để lại
 * vệt mờ ở mọi đường cắt, cả đường dọc, vì biên mảnh không rơi đúng điểm
 * ảnh. Ba mảnh ngang chỉ còn hai đường cắt, và CSS cho chúng chồng lên nhau
 * vài px nên không còn khe nào.
 *
 * CAP phải khớp `25.93cqw` trong globals.css: 280px / 1080px bề rộng.
 */
const CAP = 280;

const paper = await sharp(`${SRC}/paper.png`).trim({ threshold: 1 }).toBuffer();
const sized = await sharp(paper).resize({ width: PAPER_WIDTH }).toBuffer({ resolveWithObject: true });
const H = sized.info.height;
const piece = (top, height, name) =>
  sharp(sized.data)
    .extract({ left: 0, top, width: PAPER_WIDTH, height })
    .webp({ quality: 85, alphaQuality: 90 })
    .toFile(`public/love-story/${name}.webp`);
await piece(0, CAP, "paper-top");
await piece(CAP, H - CAP * 2, "paper-mid");
await piece(H - CAP, CAP, "paper-bottom");
console.log("paper", PAPER_WIDTH, "x", H);

/* ---------------------------------------------------- tách vật rời */

/**
 * Kéo dài sợi dây phía trên đèn: ảnh gốc cắt dây ngay sau vài cm, mà trên
 * trang mỗi đèn treo ở một độ sâu khác nhau. Dây thêm lấy đúng bề rộng và màu
 * của sợi dây thật, nên đầu dây phía trên bị mép section cắt đi chứ không lộ
 * ra một khúc nối.
 */
function withHangingString(buf) {
  return sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const xs = [];
      let [r, g, b] = [0, 0, 0];
      for (let y = 0; y < info.height && !xs.length; y++) {
        for (let x = 0; x < info.width; x++) {
          const i = (y * info.width + x) * 4;
          if (data[i + 3] > 40) {
            xs.push(x);
            r += data[i]; g += data[i + 1]; b += data[i + 2];
          }
        }
      }
      const n = xs.length || 1;
      return sharp({
        create: { width: info.width, height: info.height + STRING_EXTRA, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
      }).composite([
        {
          input: { create: { width: n, height: STRING_EXTRA + 2, channels: 3, background: { r: r / n, g: g / n, b: b / n } } },
          left: xs[0] ?? 0,
          top: 0,
        },
        { input: buf, left: 0, top: STRING_EXTRA },
      ]);
    });
}

/**
 * @param {string} file     tờ ảnh gốc
 * @param {string} prefix   tên file ra: <prefix>-01, -02…
 * @param {number} grow     bán kính phình (px ở khổ đã thu nhỏ) để gom mảng
 * @param {number} scale    hệ số thu của file ra so với tờ ảnh gốc
 */
async function split(file, prefix, grow, scale) {
  const SCALE = 6;
  const meta = await sharp(`${SRC}/${file}`).metadata();
  const w = Math.round(meta.width / SCALE);
  const h = Math.round(meta.height / SCALE);

  const { data } = await sharp(`${SRC}/${file}`)
    .resize(w, h)
    .ensureAlpha()
    .extractChannel("alpha")
    .raw()
    .toBuffer({ resolveWithObject: true });

  const solid = new Uint8Array(w * h);
  for (let i = 0; i < solid.length; i++) solid[i] = data[i] > 24 ? 1 : 0;

  // Phình theo hình vuông, tách hai lượt ngang/dọc cho rẻ.
  const dilate = (src) => {
    const tmp = new Uint8Array(w * h);
    const out = new Uint8Array(w * h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        if (src[y * w + x])
          for (let dx = -grow; dx <= grow; dx++) {
            const xx = x + dx;
            if (xx >= 0 && xx < w) tmp[y * w + xx] = 1;
          }
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        if (tmp[y * w + x])
          for (let dy = -grow; dy <= grow; dy++) {
            const yy = y + dy;
            if (yy >= 0 && yy < h) out[yy * w + x] = 1;
          }
    return out;
  };
  const blob = dilate(solid);

  const seen = new Uint8Array(w * h);
  const label = new Int32Array(w * h);
  const boxes = [];
  for (let start = 0; start < blob.length; start++) {
    if (!blob[start] || seen[start]) continue;
    let [x0, y0, x1, y1, area] = [w, h, 0, 0, 0];
    const id = boxes.length + 1;
    const stack = [start];
    seen[start] = 1;
    while (stack.length) {
      const p = stack.pop();
      label[p] = id;
      const x = p % w;
      const y = (p - x) / w;
      if (solid[p]) {
        area++;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
      for (const q of [p - 1, p + 1, p - w, p + w]) {
        if (q < 0 || q >= blob.length || !blob[q] || seen[q]) continue;
        if ((q === p - 1 && x === 0) || (q === p + 1 && x === w - 1)) continue;
        seen[q] = 1;
        stack.push(q);
      }
    }
    boxes.push(area > 40 ? { x0, y0, x1, y1 } : null);
  }

  const found = boxes.map((b, i) => (b ? { ...b, id: i + 1 } : null)).filter(Boolean);
  found.sort((a, b) => Math.round(a.y0 / (h / 4)) - Math.round(b.y0 / (h / 4)) || a.x0 - b.x0);

  for (const f of readdirSync(ELEMENTS)) if (f.startsWith(`${prefix}-`)) rmSync(`${ELEMENTS}/${f}`);

  let n = 0;
  for (const b of found) {
    n++;
    const pad = 1;
    const left = Math.max(0, (b.x0 - pad) * SCALE);
    const top = Math.max(0, (b.y0 - pad) * SCALE);
    const cw = Math.min(meta.width - left, (b.x1 - b.x0 + 1 + pad * 2) * SCALE);
    const ch = Math.min(meta.height - top, (b.y1 - b.y0 + 1 + pad * 2) * SCALE);
    const name = `${prefix}-${String(n).padStart(2, "0")}`;
    // Chỉ giữ điểm ảnh của chính vật này: khung cắt chữ nhật có thể quệt vào
    // tua hay dây của đèn bên cạnh.
    const mask = Buffer.alloc(cw * ch * 4, 255);
    for (let y = 0; y < ch; y++)
      for (let x = 0; x < cw; x++) {
        const gx = Math.min(w - 1, Math.floor((left + x) / SCALE));
        const gy = Math.min(h - 1, Math.floor((top + y) / SCALE));
        mask[(y * cw + x) * 4 + 3] = label[gy * w + gx] === b.id ? 255 : 0;
      }
    const cut = await sharp(`${SRC}/${file}`)
      .extract({ left, top, width: cw, height: ch })
      .ensureAlpha()
      .composite([{ input: mask, raw: { width: cw, height: ch, channels: 4 }, blend: "dest-in" }])
      .png()
      .toBuffer();
    const piece = await sharp(cut).resize({ width: Math.round(cw * scale) }).toBuffer();
    (await withHangingString(piece)).webp({ quality: 82, alphaQuality: 90 }).toFile(`${ELEMENTS}/${name}.webp`);
    console.log(name, cw, "x", ch);
  }
}

await split("lanterns.png", "lantern", 3, LANTERN_SCALE);
/* ------------------------------------------- tách hoa đăng theo tâm */

/**
 * Các hoa đăng nằm sát nhau, bóng nước của hoa này chồng sang hoa bên cạnh
 * nên dò mảng dính liền (như `split`) gộp cả hàng làm một. Ở đây mỗi hoa có
 * một điểm "hạt giống" (toạ độ trên bản xem 1125px của tờ ảnh) và mỗi điểm
 * ảnh thuộc về hạt giống gần nhất — hoa nào lấy phần bóng của hoa đó.
 */
const LOTUS_SEEDS = [
  [143, 765], [240, 805], [340, 855], [397, 745], [515, 805],
  [607, 845], [692, 775], [788, 815], [885, 835], [988, 872],
];

async function splitBySeeds(file, prefix, seeds, scale) {
  const { data, info } = await sharp(`${SRC}/${file}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const k = info.width / 1125;
  const pts = seeds.map(([x, y]) => [x * k, y * k]);
  const band = [Math.round(690 * k), Math.round(950 * k)];

  for (const f of readdirSync(ELEMENTS)) if (f.startsWith(`${prefix}-`)) rmSync(`${ELEMENTS}/${f}`);

  for (let n = 0; n < pts.length; n++) {
    const out = Buffer.from(data);
    let [x0, y0, x1, y1] = [info.width, info.height, 0, 0];
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * 4 + 3;
        if (y < band[0] || y > band[1] || !data[i]) { out[i] = 0; continue; }
        let best = 0, bd = Infinity;
        for (let j = 0; j < pts.length; j++) {
          const d = (x - pts[j][0]) ** 2 + (y - pts[j][1]) ** 2;
          if (d < bd) { bd = d; best = j; }
        }
        if (best !== n) { out[i] = 0; continue; }
        if (data[i] > 10) {
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
    }
    const name = `${prefix}-${String(n + 1).padStart(2, "0")}`;
    await sharp(out, { raw: info })
      .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
      .resize({ width: Math.round((x1 - x0 + 1) * scale) })
      .webp({ quality: 82, alphaQuality: 90 })
      .toFile(`${ELEMENTS}/${name}.webp`);
    console.log(name, x1 - x0 + 1, "x", y1 - y0 + 1);
  }
}

await splitBySeeds("lotus.png", "lotus", LOTUS_SEEDS, LOTUS_SCALE);

/* ---------------------------------------------------- dây hoa ở mép giấy */

/*
 * Nhánh dây leo dài của cảnh Venue (assets-source/venue/vines.png), xoay nằm
 * ngang để chạy dọc mép trên tờ giấy: gốc ở góc trái, đuôi buông về phía phải.
 * Bên phải dùng chính file này lật ngang (xem `vines` trong content/client.ts).
 * Hộp cắt đo trên bản xem 1125px của tờ ảnh gốc, nhân 3 ra khổ thật.
 */
const VINE_BOX = { left: 0, top: 0, width: 270 * 3, height: 765 * 3 };
const vine = await sharp("assets-source/venue/vines.png").extract(VINE_BOX).png().toBuffer();
const vineTrimmed = await sharp(vine).trim({ threshold: 1 }).png().toBuffer();
await sharp(vineTrimmed)
  .rotate(-90)
  .resize({ width: 1100 })
  .webp({ quality: 85, alphaQuality: 90 })
  .toFile(`${ELEMENTS}/vine-trail.webp`);
console.log("vine-trail");
