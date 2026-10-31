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

/*
  Vùng giấy bầu dục trên artboard — chữ và nút mở thiệp đặt theo đúng vùng này,
  còn trên màn ngang thì cảnh co lại để tờ giấy vẫn lọt màn. Đo từ chính file
  để không phải đoán lại khi khách đổi tranh.
*/
const { info } = await sharp(join(SRC, manifest.paper.asset))
  .trim()
  .toBuffer({ resolveWithObject: true });
const box = {
  x: -info.trimOffsetLeft,
  y: -info.trimOffsetTop,
  width: info.width,
  height: info.height,
};

const scene = {
  canvas: { width: manifest.canvas.width, height: manifest.canvas.height },
  revealDuration: manifest.revealDuration,
  water: { asset: await place(manifest.water.asset), period: manifest.water.period },
  ground: { ...manifest.ground, asset: await place(manifest.ground.asset) },
  paper: { ...manifest.paper, asset: await place(manifest.paper.asset), box },
  camera: manifest.camera,
  elements: await Promise.all(
    manifest.elements.map(async ({ png: _png, group: _group, ...e }) => ({
      ...e,
      asset: await place(e.asset),
    })),
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
