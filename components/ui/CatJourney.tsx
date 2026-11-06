"use client";

import { useEffect, useRef } from "react";

/**
 * Bé mèo tuxedo đi tìm ghế — chạy qua Hero (đồng cỏ), nhảy xuyên ranh giới
 * xuống Save the Date rồi ngồi vào ghế trái.
 *
 * Port từ public/cat-scroll-kit/integration/cat-scroll.js (đọc
 * ANIMATION-GUIDE.md ở đó). Khác bản gốc hai chỗ:
 *
 *   • Đơn vị ngang là bề rộng KHUNG TRANH của Time (`.stage-9x16`), không phải
 *     bề rộng trang: trên desktop cảnh là tấm thiệp 30rem đứng giữa, đo theo
 *     cả màn thì mèo to bằng nửa cái ghế và chạy ra tận mép màn.
 *   • Lớp mèo là con của <main>, không phải wrapper riêng bọc hai section —
 *     hai section render từ mảng `sections`, bọc lại sẽ phá thứ tự đó. Mỗi
 *     section là một stacking context `isolate` không z-index, nên lớp z-30
 *     trong <main> nằm trên cả hai và không bị cắt ở đường nối.
 *
 * Tiến trình đi theo scroll: dừng cuộn thì chân dừng, cuộn ngược tua ngược,
 * không pin, không tự chạy. Ghế (public/time/loungers-empty.webp) đã xoá mèo
 * trái, nên mèo này là con duy nhất ngồi đó.
 */

const FRAMES = ["run-01", "run-02", "run-03", "run-04", "crouch", "jump", "land", "sit"] as const;
const RUN = 0;
const CROUCH = 4;
const JUMP = 5;
const LAND = 6;
const SIT = 7;

/** Điểm chân mèo trên TOÀN khung ảnh ghế 1152×2048 (manifest.json của kit). */
const LANDING = { x: 0.363, y: 0.694 };
/** Khung sprite 512² rộng chừng này phần bề rộng tranh; neo chân ở 50% 87.5%. */
const SIZE = 0.2;
const ANCHOR_Y = 0.875;
/**
 * Một khung chân ứng với chừng này phần bề rộng mèo trên đường chạy — bước
 * chân đi theo QUÃNG ĐƯỜNG chứ không theo phần trăm cuộn, nên chạy đều nhịp
 * dù đoạn cong hay đoạn thẳng. Số lớn = bước dài, chậm rãi hơn.
 */
const STRIDE = 0.42;
/** Thời gian làm mượt (ms): cuộn giật thì mèo vẫn trôi êm theo sau. */
const SMOOTH_MS = 150;

type Point = { x: number; y: number };
type Curve = [Point, Point, Point, Point];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const cubic = (p: Curve, t: number): Point => {
  const u = 1 - t;
  return {
    x: u * u * u * p[0].x + 3 * u * u * t * p[1].x + 3 * u * t * t * p[2].x + t * t * t * p[3].x,
    y: u * u * u * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t * t * t * p[3].y,
  };
};

export function CatJourney({ upper, lower }: { upper: string; lower: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const cat = catRef.current;
    const stage = box?.parentElement;
    const top = document.getElementById(upper);
    const bottom = document.getElementById(lower);
    const art = bottom?.querySelector<HTMLElement>("[data-cat-seat]");
    if (!box || !cat || !stage || !top || !bottom || !art) return;

    const frames = [...cat.querySelectorAll<HTMLImageElement>("img")];
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    type Geom = {
      w: number;
      run: Curve[];
      jump: Curve[];
      end: Point;
      start: number;
      finish: number;
      /** Quãng đường cộng dồn dọc đường chạy, lấy mẫu đều theo tham số. */
      runLength: number[];
    };
    const SAMPLES = 120;
    let geom: Geom | null = null;
    let target = 0;
    let current = 0;
    let raf = 0;
    let last = 0;

    const measure = () => {
      const sr = stage.getBoundingClientRect();
      const ur = top.getBoundingClientRect();
      const lr = bottom.getBoundingClientRect();
      const ar = art.getBoundingClientRect();
      if (!ar.width) return;

      /* Toạ độ trong <main>; mọi x đo từ mép trái khung tranh, theo bề rộng nó. */
      const w = ar.width;
      const ox = ar.left - sr.left;
      const P = (x: number, y: number): Point => ({ x: ox + x * w, y });
      const t0 = ur.top - sr.top;
      const uh = ur.height;
      const end = { x: ox + w * LANDING.x, y: ar.top - sr.top + ar.height * LANDING.y };

      /* Đường chạy trong Hero theo reference/trajectory-markup.png: ló ra từ mép
         trái, vòng xuống bên trái cặp đôi, lượn sang giữa ở đáy section. */
      const run: Curve[] = [
        [P(-0.12, t0 + 0.51 * uh), P(0.08, t0 + 0.5 * uh), P(0.02, t0 + 0.75 * uh), P(0.15, t0 + 0.82 * uh)],
        [P(0.15, t0 + 0.82 * uh), P(0.21, t0 + 0.87 * uh), P(0.36, t0 + 0.86 * uh), P(0.36, t0 + 0.88 * uh)],
        [P(0.36, t0 + 0.88 * uh), P(0.54, t0 + 0.94 * uh), P(0.55, t0 + 0.97 * uh), P(0.43, t0 + uh - 0.012 * w)],
      ];
      const takeoff = run[2][3];
      const lt = lr.top - sr.top;
      /* Một cú nhảy hai đoạn cong, bám lề trái section đỏ để không đè chữ/nút. */
      const jump: Curve[] = [
        [takeoff, P(0.3, lt - 0.08 * w), P(0.025, lt + 0.13 * w), P(0.055, lt + 0.5 * w)],
        [P(0.055, lt + 0.5 * w), P(0.04, lt + 0.9 * w), P(0.08, end.y - 0.21 * w), end],
      ];

      const runLength = [0];
      let prev = cubic(run[0], 0);
      for (let k = 1; k <= SAMPLES; k++) {
        const q = (k / SAMPLES) * 3;
        const i = Math.min(2, Math.floor(q));
        const pt = cubic(run[i], q - i);
        runLength.push(runLength[k - 1] + Math.hypot(pt.x - prev.x, pt.y - prev.y));
        prev = pt;
      }

      const pageTop = sr.top + window.scrollY;
      geom = {
        w,
        run,
        jump,
        end,
        runLength,
        start: Math.max(pageTop + t0, pageTop + run[0][0].y - window.innerHeight * 0.7),
        finish: pageTop + end.y - window.innerHeight * 0.68,
      };
      read();
    };

    const pose = (p: number) => {
      const g = geom!;
      let pos: Point;
      let a = 0;
      let frame = RUN;
      let next = -1;
      let mix = 0;
      let sx = 1;
      let sy = 1;
      if (p < 0.48) {
        const q = (p / 0.48) * 3;
        const i = Math.min(2, Math.floor(q));
        pos = cubic(g.run[i], q - i);
        /* Khung chân tính từ quãng đường đã đi: ngừng cuộn là chân ngừng, và
           bước đều nhịp chứ không dồn dập khi cuộn nhanh. */
        const at = (p / 0.48) * SAMPLES;
        const k = Math.min(SAMPLES - 1, Math.floor(at));
        const dist = lerp(g.runLength[k], g.runLength[k + 1], at - k);
        const step = dist / (g.w * SIZE * STRIDE);
        frame = Math.floor(step) % 4;
        /* Nảy nhẹ một lần mỗi hai khung, nghiêng nhẹ theo nhịp dài — không lắc. */
        a = 6 + Math.sin(step * 0.35) * 3;
        pos = { x: pos.x, y: pos.y - Math.abs(Math.sin((step * Math.PI) / 2)) * g.w * 0.0025 };
      } else if (p < 0.53) {
        pos = g.run[2][3];
        frame = CROUCH;
        const q = ease((p - 0.48) / 0.05);
        sx = 1 + 0.06 * q;
        sy = 1 - 0.05 * q;
      } else if (p < 0.9) {
        const q = ((p - 0.53) / 0.37) * 2;
        const i = Math.min(1, Math.floor(q));
        pos = cubic(g.jump[i], q - i);
        frame = JUMP;
        /* Pose nhảy đã vẽ chéo sẵn — chỉ nghiêng thêm chút, không xoay theo tiếp tuyến. */
        a = lerp(-12, 16, Math.sin(clamp((p - 0.53) / 0.37) * Math.PI));
        if (p > 0.875) {
          next = LAND;
          mix = ease((p - 0.875) / 0.025);
          a *= 1 - mix;
        }
      } else if (p < 0.95) {
        pos = g.end;
        frame = LAND;
        const q = (p - 0.9) / 0.05;
        sy = 1 - 0.1 * Math.sin(Math.PI * q);
        sx = 1 + 0.07 * Math.sin(Math.PI * q);
      } else {
        pos = g.end;
        frame = LAND;
        next = SIT;
        mix = ease(clamp((p - 0.95) / 0.045));
      }
      return { pos, a, frame, next, mix, sx, sy };
    };

    const render = (p: number) => {
      if (!geom) return;
      const reduced = mq.matches;
      const { pos, a, frame, next, mix, sx, sy } = pose(reduced ? 1 : p);
      const s = geom.w * SIZE;
      cat.style.width = `${s}px`;
      cat.style.height = `${s}px`;
      cat.style.opacity = reduced ? "1" : String(clamp(p / 0.025));
      cat.style.transform = `translate3d(${pos.x - s / 2}px, ${pos.y - s * ANCHOR_Y}px, 0) rotate(${a}deg) scale(${sx}, ${sy})`;
      frames.forEach((img, i) => {
        img.style.opacity = String(i === frame ? 1 - mix : i === next ? mix : 0);
      });
    };

    /* Làm mượt ~150ms để trackpad không rung, rồi đứng yên khi tới đích. */
    const loop = (time: number) => {
      raf = 0;
      const dt = last ? Math.min(40, time - last) : 16.7;
      last = time;
      current += (target - current) * (1 - Math.exp(-dt / SMOOTH_MS));
      if (Math.abs(current - target) < 0.00005) current = target;
      render(current);
      if (current !== target) raf = requestAnimationFrame(loop);
      else last = 0;
    };

    function read() {
      if (!geom) return;
      target = clamp((window.scrollY - geom.start) / Math.max(1, geom.finish - geom.start));
      if (mq.matches) {
        current = target;
        render(current);
      } else if (!raf) raf = requestAnimationFrame(loop);
    }

    const onMotionPref = () => {
      current = target;
      render(current);
    };

    const ro = new ResizeObserver(measure);
    [stage, top, bottom, art].forEach((el) => ro.observe(el));
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", measure);
    mq.addEventListener("change", onMotionPref);
    let alive = true;
    void document.fonts?.ready.then(() => alive && measure());

    measure();
    current = target;
    render(current);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", onMotionPref);
    };
  }, [upper, lower]);

  return (
    <div ref={boxRef} aria-hidden className="cat-journey">
      <div ref={catRef} className="cat-journey-cat">
        {FRAMES.map((name) => (
          // eslint-disable-next-line @next/next/no-img-element -- sprite 256², đổi frame bằng opacity
          <img key={name} src={`/cat/cat-${name}.webp`} alt="" draggable={false} />
        ))}
      </div>
    </div>
  );
}
