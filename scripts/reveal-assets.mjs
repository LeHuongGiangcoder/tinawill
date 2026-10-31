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
/** Ảnh phủ cả artboard (nền tán lá, nước) hạ về bề rộng này: giải nén 1152×2048 tốn ~9MB mỗi lớp, iPhone đóng tab khi quá tải. */
const FULL_BLEED_WIDTH = 864;
const place = async (asset) => {
  const name = target(asset);
  if (!copied.has(name)) {
    copied.set(name, true);
    const from = join(SRC, asset);
    const full = /canopy-ground|river-seamless/.test(asset);
    if (full) await sharp(from).resize({ width: FULL_BLEED_WIDTH }).webp({ quality: 84, alphaQuality: 90 }).toFile(join(OUT, name));
    else if (asset.endsWith(".webp")) copyFileSync(from, join(OUT, name));
    else await sharp(from).webp({ quality: 84, alphaQuality: 90 }).toFile(join(OUT, name));
  }
  return `/reveal/${name}`;
};

mkdirSync(OUT, { recursive: true });
for (const name of ["agave", "leaf-sprigs"]) copyFileSync(`public/tropical/${name}.webp`, join(OUT, `${name}.webp`));

/** Tờ giấy do khách vẽ lại (public/hero paper.png, 9:16 như artboard), thay file trong package. */
const PAPER_SOURCE = "public/hero paper.png";
const placePaper = async (asset) => {
  const name = target(asset);
  await sharp(PAPER_SOURCE)
    .resize(FULL_BLEED_WIDTH, Math.round((FULL_BLEED_WIDTH * manifest.canvas.height) / manifest.canvas.width))
    .webp({ quality: 86, alphaQuality: 92 })
    .toFile(join(OUT, name));
  return `/reveal/${name}`;
};

/*
  Vùng giấy bầu dục trên artboard — chữ và nút mở thiệp đặt theo đúng vùng này,
  còn trên màn ngang thì cảnh co lại để tờ giấy vẫn lọt màn. Đo từ chính file
  để không phải đoán lại khi khách đổi tranh.
*/
const { info } = await sharp(PAPER_SOURCE)
  .resize(manifest.canvas.width, manifest.canvas.height)
  .toBuffer()
  .then((buffer) => sharp(buffer).trim().toBuffer({ resolveWithObject: true }));
const box = {
  x: -info.trimOffsetLeft,
  y: -info.trimOffsetTop,
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
  "mid_left-04-pineapple": { x: 225, y: 1190, width: 250, rotation: 0 },
  "top_left-02-mango": { x: 235, y: 212, width: 470, rotation: 6 },
  "bottom_left-03-hibiscus": { x: 160, y: 1506.1, width: 370 },
  "bottom_left-02-frond": { x: 230, y: 1960, width: 900 },
  "top_right-02-hibiscus": { x: 1042.3, y: 152.6, width: 353.2, flipX: true },
  "mid_right-02-plumeria": { x: 629.1, y: 679.4, width: 287.0, rotation: 0 },
  "bottom_right-02-pomegranate": { x: 910, y: 1740, width: 440, rotation: 30 },
  "bottom_right-01-fan": { x: 990, y: 1790 },
  "bottom_right-03-bracts_purple": { x: 1000, y: 1330 },
  "mid_left-02-heliconia": { x: 133.8, y: 626.8, width: 527.6 },
  "mid_right-01-frond": { x: 966.3, y: 690 },
  "top_right-01-frond": { x: 705, y: 156 },
  "top_right-03-bracts_pink": { x: 682, y: 276.7, width: 178.8 },
  "lower_bract-01-bracts_pink": { x: 552.4, y: 1831.2, width: 178.8 },
};

/* Ảnh khách vẽ lại, cắt từ public/lê.png: đủ cụm xoài và cả quả dứa, không bị
   cắt cụt như file trong package. */
const ASSET_SWAP = {
  "mid_left-04-pineapple": { asset: "/reveal/pineapple-new.webp", rawSize: [700, 1091] },
  "top_left-02-mango": { asset: "/reveal/mango-new.webp", rawSize: [900, 822] },
};

/* Sprite thêm vào: mượn nhịp mở và quỹ đạo của `ref`, dịch trạng thái mở theo
   `exit` (px artboard) để chúng thoát ra cùng cú mở tán. */
const EXTRA = [
  { id: "bottom_left-05-bracts_purple", asset: "/reveal/bracts_purple.webp", rawSize: [276, 267], ref: "bottom_left-04-bracts_pink", z: 4410, closed: { x: 330, y: 1840, width: 120, rotation: -10 } },
  { id: "bottom_left-06-bracts_purple", asset: "/reveal/bracts_purple.webp", rawSize: [276, 267], ref: "bottom_left-04-bracts_pink", z: 4411, closed: { x: 255, y: 1905, width: 95, rotation: 20 } },
  { id: "mid_right-04-heliconia", asset: "/reveal/heliconia.webp", rawSize: [553, 741], ref: "mid_right-01-frond", z: 4303, closed: { x: 1110, y: 1470, width: 340, rotation: -75 } },
  { id: "bottom_right-04-hibiscus", asset: "/reveal/hibiscus.webp", rawSize: [352, 344], ref: "top_right-02-hibiscus", z: 4499, closed: { x: 1090, y: 1990, width: 380, rotation: -20 }, exit: [60, 90] },
  { id: "mid_right-03-pear", asset: "/reveal/pear-new.webp", rawSize: [700, 987], ref: "mid_right-02-plumeria", z: 4302, closed: { x: 915, y: 1285, width: 235, rotation: 5 } },
  { id: "bottom_mid-01-leaf", asset: "/reveal/leaf-new.webp", rawSize: [700, 1062], ref: "bottom_left-02-frond", z: 4410, closed: { x: 610, y: 1800, width: 260, rotation: 30 }, exit: [40, 90] },
  { id: "bottom_mid-02-agave", asset: "/reveal/agave.webp", rawSize: [1100, 772], ref: "bottom_left-02-frond", z: 4411, closed: { x: 600, y: 1960, width: 420, rotation: 0 }, exit: [-40, 90] },
  { id: "bottom_mid-03-sprigs", asset: "/reveal/leaf-sprigs.webp", rawSize: [408, 720], ref: "bottom_right-01-fan", z: 4412, closed: { x: 730, y: 1900, width: 200, rotation: 25 }, exit: [60, 80] },
];

/* Xoài nằm lớp trên cùng của cảnh, không lá nào che. */
const Z_OVERRIDE = { "top_left-02-mango": 5000 };

/* Bỏ bớt lá và bract ở đáy giữa cho đỡ rối. */
const DROP = new Set(["bottom_mid-01-leaf", "bottom_mid-03-sprigs", "lower_bract-01-bracts_pink", "bottom_left-04-bracts_pink", "top_left-03-bracts_purple", "top_left-04-bracts_pink", "bottom_right-03-bracts_purple", "bottom_right-01-fan", "deep_right-04-fan"]);

const relayout = ({ closed, open, ...e }) => {
  const o = CANVA_CLOSED[e.id];
  if (Z_OVERRIDE[e.id]) e.z = Z_OVERRIDE[e.id];
  const swap = ASSET_SWAP[e.id];
  if (swap) Object.assign(e, swap);
  if (!o) return { ...e, closed, open };
  const next = { ...closed, ...o };
  return {
    ...e,
    closed: next,
    open: { ...open, x: open.x + next.x - closed.x, y: open.y + next.y - closed.y },
  };
};

/* Hero mở ra chỉ còn nền giấy: mọi lá, hoa, quả tan hết theo cú mở tán. */
const withExtras = (list) => {
  const byId = new Map(list.map((e) => [e.id, e]));
  const extras = EXTRA.map(({ ref, closed, exit, id, asset, rawSize, z }) => {
    const r = byId.get(ref);
    const c = { x: closed.x, y: closed.y, width: closed.width, rotation: closed.rotation, flipX: false, opacity: 1 };
    const dx = exit ? exit[0] : r.open.x - r.closed.x;
    const dy = exit ? exit[1] : r.open.y - r.closed.y;
    return {
      id,
      asset,
      rawSize,
      z,
      reveal: r.reveal,
      motion: r.motion,
      closed: c,
      open: { ...c, x: c.x + dx, y: c.y + dy, width: c.width * (r.open.width / r.closed.width), rotation: c.rotation + (r.open.rotation - r.closed.rotation) },
    };
  });
  /* Hero mở ra chỉ còn nền giấy: mọi lá, hoa, quả tan hết theo cú mở tán. */
  return [...list, ...extras]
    .filter((e) => !DROP.has(e.id))
    .map((e) => ({ ...e, open: { ...e.open, opacity: 0 } }));
};

const scene = {
  canvas: { width: manifest.canvas.width, height: manifest.canvas.height },
  revealDuration: manifest.revealDuration,
  water: { asset: await place(manifest.water.asset), period: manifest.water.period },
  ground: { ...manifest.ground, asset: await place(manifest.ground.asset) },
  paper: { ...manifest.paper, asset: await placePaper(manifest.paper.asset), box },
  camera: manifest.camera,
  elements: withExtras(
    await Promise.all(
      manifest.elements.map(async ({ png: _png, group: _group, ...e }) =>
        relayout({ ...e, asset: await place(e.asset) }),
      ),
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
