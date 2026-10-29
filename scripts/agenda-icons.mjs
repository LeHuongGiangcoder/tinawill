/**
 * Tách mỗi con tem của trang "Agenda" thành hai lớp: khung và icon.
 *
 *   node scripts/agenda-icons.mjs
 *
 * Chạy SAU scripts/agenda-assets.mjs — đầu vào là public/agenda/<tên>.webp.
 *
 * Khách vẽ icon dính liền vào khung trên cùng một tờ giấy, nhưng con tem
 * đang chọn cần icon đung đưa còn khung đứng yên. Nên script:
 *
 *   1. đo màu giấy của từng con tem (trung vị các điểm sáng, nhạt màu);
 *   2. gieo hạt ở mọi điểm "không phải giấy" trong vùng giữa tem rồi loang
 *      ra các điểm "không phải giấy" liền kề — icon là một mảng liền, còn
 *      khung bị một dải giấy trơn cắt rời nên loang không tới;
 *   3. xuất <tên>-icon.webp: chỉ icon, nền trong suốt, mép mềm theo độ lệch
 *      màu so với giấy;
 *   4. xuất <tên>-frame.webp: con tem gốc với chỗ icon tô lại bằng màu giấy,
 *      để khi icon nghiêng đi không lộ ra một icon thứ hai đứng yên bên dưới.
 *
 * Hai file cùng kích thước với tem gốc, nên đặt chồng lên nhau là khớp.
 */

import sharp from "sharp";

const DIR = "public/agenda";
const NAMES = ["cocktail", "sun", "monstera"];

/** Lệch màu so với giấy: dưới T0 là giấy, trên T1 là icon đặc. */
const T0 = 38;
const T1 = 80;
/** Vùng gieo hạt: bỏ đi chừng này phần mỗi cạnh — khung nằm hết ngoài đó. */
const SEED_INSET = 0.24;
/** Nới mặt nạ thêm vài px khi tô khung, để không sót viền nhoè của icon. */
const DILATE = 3;

for (const name of NAMES) {
  const { data, info } = await sharp(`${DIR}/${name}.webp`)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (x, y) => (y * w + x) * 4;

  /* 1. Màu giấy: trung vị của các điểm sáng và ít sắc trong vùng giữa. */
  const rs = [], gs = [], bs = [];
  for (let y = Math.floor(h * 0.15); y < h * 0.85; y += 2) {
    for (let x = Math.floor(w * 0.15); x < w * 0.85; x += 2) {
      const i = px(x, y);
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (max > 200 && max - min < 70) {
        rs.push(r); gs.push(g); bs.push(b);
      }
    }
  }
  const median = (a) => a.sort((p, q) => p - q)[a.length >> 1];
  const paper = [median(rs), median(gs), median(bs)];

  const dist = new Float32Array(w * h);
  for (let k = 0; k < w * h; k++) {
    const i = k * 4;
    dist[k] = Math.hypot(data[i] - paper[0], data[i + 1] - paper[1], data[i + 2] - paper[2]);
  }

  /* 2. Loang từ vùng giữa qua các điểm không phải giấy. */
  const icon = new Uint8Array(w * h);
  const queue = [];
  const x0 = Math.floor(w * SEED_INSET), x1 = Math.ceil(w * (1 - SEED_INSET));
  const y0 = Math.floor(h * SEED_INSET), y1 = Math.ceil(h * (1 - SEED_INSET));
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const k = y * w + x;
      if (dist[k] > T0) {
        icon[k] = 1;
        queue.push(k);
      }
    }
  }
  while (queue.length) {
    const k = queue.pop();
    const x = k % w, y = (k / w) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const n = ny * w + nx;
      if (!icon[n] && dist[n] > T0) {
        icon[n] = 1;
        queue.push(n);
      }
    }
  }

  /* Nới mặt nạ: lấy luôn quầng mờ của nét vẽ quanh icon. */
  let grown = icon;
  for (let step = 0; step < DILATE; step++) {
    const next = grown.slice();
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const k = y * w + x;
        if (!grown[k] && (grown[k - 1] || grown[k + 1] || grown[k - w] || grown[k + w])) next[k] = 1;
      }
    }
    grown = next;
  }

  /* 3 + 4. Lớp icon và lớp khung. */
  const iconBuf = Buffer.alloc(w * h * 4);
  const frameBuf = Buffer.from(data);
  let count = 0;
  for (let k = 0; k < w * h; k++) {
    if (!grown[k]) continue;
    const i = k * 4;
    const t = Math.min(1, Math.max(0, (dist[k] - T0 * 0.5) / (T1 - T0 * 0.5)));
    iconBuf[i] = data[i];
    iconBuf[i + 1] = data[i + 1];
    iconBuf[i + 2] = data[i + 2];
    iconBuf[i + 3] = Math.round(t * data[i + 3]);
    frameBuf[i] = paper[0];
    frameBuf[i + 1] = paper[1];
    frameBuf[i + 2] = paper[2];
    if (icon[k]) count++;
  }

  const raw = { raw: { width: w, height: h, channels: 4 } };
  await sharp(iconBuf, raw).webp({ quality: 88, alphaQuality: 90 }).toFile(`${DIR}/${name}-icon.webp`);
  await sharp(frameBuf, raw).webp({ quality: 88 }).toFile(`${DIR}/${name}-frame.webp`);

  console.log(
    `${name.padEnd(9)} giấy rgb(${paper.join(", ")})  icon ${((count / (w * h)) * 100).toFixed(1)}% tem`,
  );
}
