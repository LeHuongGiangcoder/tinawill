/**
 * Nhận bộ design system khách gửi và biến nó thành một bản kê có kiểu.
 *
 *   brand/<nhóm>/<tên>.<ext>   →   public/brand/<nhóm>/<tên>.<ext>
 *                              →   content/assets.ts
 *
 * Chạy: npm run assets
 *
 * Script chỉ chép file và đọc kích thước — nó KHÔNG tự quyết định asset nào
 * dùng ở section nào. Việc gắn vào chỗ nào là ở `design` trong
 * content/client.ts, và tên trong đó được TypeScript kiểm tra theo đúng bản
 * kê này, nên gõ sai tên file là build đỏ ngay chứ không âm thầm mất ảnh.
 */

import { readdir, mkdir, copyFile, writeFile, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "brand");
const OUT = path.join(ROOT, "public", "brand");
const MANIFEST = path.join(ROOT, "content", "assets.ts");

/** Bốn nhóm, mỗi nhóm một vai trò khác nhau trên trang. */
const GROUPS = [
  ["textures", "Vân giấy / hoạ tiết lặp, trải kín nền section"],
  ["backgrounds", "Ảnh nền full-bleed của một section"],
  ["elements", "Hoạ tiết rời (hoa, ruy băng, con dấu) — nền trong suốt"],
  ["dividers", "Dải ngăn giữa hai section, lặp theo chiều ngang"],
];

const ALLOWED = new Set([".webp", ".png", ".jpg", ".jpeg", ".svg", ".avif"]);

/* ------------------------------------------------- đọc kích thước ảnh */

/** Đọc width/height từ header, không cần thư viện ngoài. */
function readSize(buf, ext) {
  try {
    if (ext === ".png") return readPng(buf);
    if (ext === ".jpg" || ext === ".jpeg") return readJpeg(buf);
    if (ext === ".webp") return readWebp(buf);
    if (ext === ".svg") return readSvg(buf);
  } catch {
    /* Hỏng header thì trả null — bản kê vẫn có file, chỉ thiếu số đo. */
  }
  return null;
}

function readPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readJpeg(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    // SOF0..SOF15, trừ DHT/JPG/DAC — các marker này mang kích thước ảnh
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function readWebp(buf) {
  if (buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const kind = buf.toString("ascii", 12, 16);
  if (kind === "VP8X") {
    return {
      width: 1 + buf.readUIntLE(24, 3),
      height: 1 + buf.readUIntLE(27, 3),
    };
  }
  if (kind === "VP8 ") {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (kind === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function readSvg(buf) {
  const head = buf.toString("utf8", 0, 2000);
  const viewBox = head.match(/viewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/i);
  if (viewBox) return { width: Math.round(+viewBox[1]), height: Math.round(+viewBox[2]) };
  const w = head.match(/\bwidth\s*=\s*["']([\d.]+)/i);
  const h = head.match(/\bheight\s*=\s*["']([\d.]+)/i);
  if (w && h) return { width: Math.round(+w[1]), height: Math.round(+h[1]) };
  return null;
}

/* ----------------------------------------------------------- chạy */

/** Tên dùng trong code: bỏ đuôi, về kebab-case. */
function slug(file) {
  return path
    .basename(file, path.extname(file))
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function collect(group) {
  const dir = path.join(SRC, group);
  if (!existsSync(dir)) return [];

  const files = (await readdir(dir)).filter((f) => ALLOWED.has(path.extname(f).toLowerCase()));
  const seen = new Map();
  const items = [];

  for (const file of files.sort()) {
    const name = slug(file);
    if (!name) continue;
    if (seen.has(name)) {
      console.warn(
        `  ⚠ ${group}/${file} và ${group}/${seen.get(name)} cùng ra tên "${name}" — bỏ qua file sau`,
      );
      continue;
    }
    seen.set(name, file);

    const from = path.join(dir, file);
    const buf = await readFile(from);
    const size = readSize(buf, path.extname(file).toLowerCase());

    await mkdir(path.join(OUT, group), { recursive: true });
    await copyFile(from, path.join(OUT, group, file));

    items.push({ name, src: `/brand/${group}/${file}`, size, bytes: buf.length });
  }

  return items;
}

function render(groups) {
  const body = GROUPS.map(([group, note]) => {
    const items = groups[group];
    if (items.length === 0) return `  /** ${note} */\n  ${group}: {},`;
    const rows = items
      .map((item) => {
        const dims = item.size ? `, width: ${item.size.width}, height: ${item.size.height}` : "";
        return `    "${item.name}": { src: "${item.src}"${dims} },`;
      })
      .join("\n");
    return `  /** ${note} */\n  ${group}: {\n${rows}\n  },`;
  }).join("\n\n");

  const types = GROUPS.map(([group]) => {
    const single = group.replace(/s$/, "");
    const Pascal = single.charAt(0).toUpperCase() + single.slice(1);
    return `export type ${Pascal}Name = keyof typeof assets.${group};`;
  }).join("\n");

  return `/**
 * TỰ SINH — đừng sửa tay. Chạy \`npm run assets\` để dựng lại.
 *
 * Bản kê những gì đang có trong brand/. Nguồn thật nằm ở brand/, bản chép để
 * phục vụ nằm ở public/brand/. Gắn asset vào section ở \`design\` trong
 * content/client.ts; TypeScript sẽ bắt lỗi nếu gõ sai tên.
 */

export const assets = {
${body}
} as const;

${types}
`;
}

async function main() {
  // Dọn bản chép cũ, để file đã xoá khỏi brand/ không còn lảng vảng trong public/
  if (existsSync(OUT)) await rm(OUT, { recursive: true });

  const groups = {};
  let total = 0;

  for (const [group, note] of GROUPS) {
    groups[group] = await collect(group);
    total += groups[group].length;
    const list = groups[group].map((i) => i.name).join(", ") || "—";
    console.log(`${group.padEnd(12)} ${String(groups[group].length).padStart(2)}  ${list}`);
    void note;
  }

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, render(groups), "utf8");

  console.log(`\n→ content/assets.ts (${total} asset)`);
  if (total === 0) {
    console.log("   brand/ đang trống — thả file vào rồi chạy lại.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
