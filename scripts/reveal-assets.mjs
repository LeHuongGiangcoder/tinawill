/**
 * Cảnh reveal của intro + hero: package khách gửi → bản dùng thật.
 *
 *   node scripts/reveal-assets.mjs
 *
 * Package nặng 21MB vì kèm PNG gốc, video và tranh đối chiếu. Script chỉ lấy
 * đúng những file cảnh cần sang public/reveal, và sinh content/reveal-scene.json
 * từ scene-manifest.json với đường dẫn đã đổi, bỏ các trường chỉ dành cho công
 * cụ dựng (png, rawSize vẫn giữ để Image biết tỉ lệ).
 *
 * KHÔNG để trong public/brand: `npm run assets` xoá sạch thư mục đó.
 */

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import sharp from "sharp";

const SRC = "public/tropical-reveal-package";
const OUT = "public/reveal";

const manifest = JSON.parse(readFileSync(join(SRC, "scene-manifest.json"), "utf8"));

/** Mỗi file nguồn một đích; hai thư mục floaters/ripples trùng tên nên giữ tiền tố. */
const target = (asset) => {
  const folder = basename(dirname(asset));
  const name = basename(asset).replace(/\.png$/, ".webp");
  return folder === "floaters" || folder === "ripples" ? `${folder}-${name}` : name;
};

/* Tờ giấy của Canva nằm giữa artboard (576, 1084); file package lệch (+24, +29). */
const PAPER_SHIFT = { x: -24, y: -29 };

const copied = new Map();
const place = async (asset) => {
  const name = target(asset);
  if (!copied.has(name)) {
    copied.set(name, true);
    const from = join(SRC, asset);
    if (asset.endsWith(".webp")) copyFileSync(from, join(OUT, name));
    else await sharp(from).webp({ quality: 84, alphaQuality: 90 }).toFile(join(OUT, name));
  }
  return `/reveal/${name}`;
};

mkdirSync(OUT, { recursive: true });

/** Dời tờ giấy theo PAPER_SHIFT (âm = sang trái/lên) trên cùng khung artboard. */
const placePaper = async (asset) => {
  const name = target(asset);
  const { width, height } = manifest.canvas;
  const dx = -PAPER_SHIFT.x;
  const dy = -PAPER_SHIFT.y;
  await sharp(join(SRC, asset))
    .extract({ left: dx, top: dy, width: width - dx, height: height - dy })
    .extend({ right: dx, bottom: dy, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 84, alphaQuality: 90 })
    .toFile(join(OUT, name));
  return `/reveal/${name}`;
};

/*
  Vùng giấy bầu dục trên artboard — chữ và nút mở thiệp đặt theo đúng vùng này,
  còn trên màn ngang thì cảnh co lại để tờ giấy vẫn lọt màn. Đo từ chính file
  để không phải đoán lại khi khách đổi tranh.
*/
const { info } = await sharp(join(SRC, manifest.paper.asset))
  .trim()
  .toBuffer({ resolveWithObject: true });
const box = {
  x: -info.trimOffsetLeft + PAPER_SHIFT.x,
  y: -info.trimOffsetTop + PAPER_SHIFT.y,
  width: info.width,
  height: info.height,
};

/*
  Bố cục đóng (trang 1 của Canva "Dekko", 1080×1920) quy về artboard 1152×2048
  (×16/15): tâm, bề rộng, góc xoay của từng sprite đọc từ layer Canva. Trạng thái
  mở dịch đúng bằng độ lệch của trạng thái đóng, nên quỹ đạo thoát ra ngoài giữ
  nguyên. Sprite nào không có ở đây thì giữ toạ độ của package.
*/
const CANVA_CLOSED = {
  "mid_left-04-pineapple": { x: 115.2, y: 1047.9, width: 293.5, rotation: 0 },
  "bottom_left-03-hibiscus": { x: 173.8, y: 1506.1, width: 449.8 },
  "top_right-02-hibiscus": { x: 1042.3, y: 152.6, width: 353.2, flipX: true },
  "mid_right-02-plumeria": { x: 629.1, y: 679.4, width: 287.0, rotation: 0 },
  "bottom_right-02-pomegranate": { x: 938.7, y: 1683.1, width: 501.6, rotation: 30 },
  "mid_left-02-heliconia": { x: 133.8, y: 626.8, width: 527.6, rotation: -28 },
  "top_right-03-bracts_pink": { x: 776.3, y: 276.7, width: 178.8 },
  "lower_bract-01-bracts_pink": { x: 552.4, y: 1831.2, width: 178.8 },
};

const relayout = ({ closed, open, ...e }) => {
  const o = CANVA_CLOSED[e.id];
  if (!o) return { ...e, closed, open };
  const next = { ...closed, ...o };
  return {
    ...e,
    closed: next,
    open: { ...open, x: open.x + next.x - closed.x, y: open.y + next.y - closed.y },
  };
};

const scene = {
  canvas: { width: manifest.canvas.width, height: manifest.canvas.height },
  revealDuration: manifest.revealDuration,
  water: { asset: await place(manifest.water.asset), period: manifest.water.period },
  ground: { ...manifest.ground, asset: await place(manifest.ground.asset) },
  paper: { ...manifest.paper, asset: await placePaper(manifest.paper.asset), box },
  camera: manifest.camera,
  elements: await Promise.all(
    manifest.elements.map(async ({ png: _png, group: _group, ...e }) =>
      relayout({ ...e, asset: await place(e.asset) }),
    ),
  ),
  floaters: await Promise.all(
    manifest.floaters.map(async ({ png: _png, ...f }) => ({
      ...f,
      asset: await place(f.asset),
      ripple: { ...f.ripple, asset: await place(f.ripple.asset) },
    })),
  ),
};

writeFileSync("content/reveal-scene.json", `${JSON.stringify(scene, null, 2)}\n`);
console.log(`reveal: ${copied.size} file → ${OUT}, vùng giấy`, box);
