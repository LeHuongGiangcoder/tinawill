"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { Intro } from "@/components/sections/Intro";
import { sections } from "@/content/client";
import scene from "@/content/opening-scene.json";

/**
 * Màn mở thiệp nhiệt đới, tách lớp từ một bức tranh nền đen
 * (public/intro updated.png) rồi đặt lên nền xanh rừng. Các lớp chia nhau từng
 * pixel của tranh, nên lúc đứng yên chúng ghép lại đúng bức gốc. Tờ giấy bầu
 * dục và chữ "Hi :)" nằm trên cùng; bấm mở thì giấy tan để lộ cả bức tranh,
 * rồi chim cất cánh và tán lá dạt ra.
 *
 * Toạ độ, thứ tự lớp, cụm và nhịp đọc từ content/opening-scene.json. Mọi thứ
 * là hàm thuần của thời gian `t` (giây kể từ cú chạm), nên `?scene-t=1.4` ở
 * môi trường dev đóng băng cảnh ở đúng một khung để soi.
 *
 * Chuyển động dựa trên Animation_Guide của kit nhưng sửa những chỗ làm nó
 * trông "máy":
 *   - Trước khi chạm, tán lá thở theo gió và con vẹt giật đầu từng nhịp như
 *     chim thật — chứ không đứng chết như ảnh tĩnh.
 *   - Mỗi layer là MỘT cành cùng mọi thứ mọc trên nó (lá, hoa, quả), chia theo
 *     mép lá chứ không theo ô lưới — nên không có cành nào bị cắt đôi, không có
 *     quả nào rời cuống mà bay đi. Cả cành xoay quanh gốc của nó (chỗ cành đi
 *     vào khung) và luôn mở ra xa khỏi đường đi của camera; rotation trễ hơn vị
 *     trí một chút (follow-through).
 *   - Vật tự do chỉ có ba thứ: con chim, một quả đu đủ đứt cuống rơi xuống theo
 *     trọng lực, và vài chiếc lá rơi đạt vận tốc giới hạn rồi lượn.
 *   - Khe hở giữa các cành để thoáng, lộ giấy ô liu của design system
 *     (`data-ground="olive"`). Mọi cành phải ra hẳn khỏi khung trước
 *     `scene.duration`, vì lúc đó artboard bị tháo — còn sót là giật.
 *   - Cú bật của chim làm cành đậu nhún rồi dao động tắt dần; đập cánh theo
 *     nhịp xuống nhanh – lên chậm, thân nhấp nhô ngược pha cánh.
 */

const { canvas, paper, ground, camera, groups, items, bird, fruitDrop, leaves } = scene;

type Group = (typeof groups)[keyof typeof groups];
type Item = (typeof items)[number];
type Vec = [number, number];

/** Tờ giấy chiếm tối đa chừng này chiều cao màn — xem `fit` bên dưới. */
const PAPER_FILL = 0.92;
/** Một nhịp đập cánh, giây. */
const FLAP_PERIOD = 0.27;

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** smootherstep: vận tốc và gia tốc về 0 ở hai đầu. */
const smoother = (t: number) => {
  const u = clamp(t);
  return u * u * u * (u * (u * 6 - 15) + 10);
};
const sineInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t));
/** Cú giật đầu của chim: tới nhanh, quá đà một chút rồi đứng. */
const snap = (t: number) => {
  const u = clamp(t);
  const c = 1.9;
  return 1 + (c + 1) * (u - 1) ** 3 + c * (u - 1) ** 2;
};
const rad = (deg: number) => (deg * Math.PI) / 180;
const rotateAround = (p: Vec, pivot: Vec, deg: number): Vec => {
  const a = rad(deg);
  const dx = p[0] - pivot[0];
  const dy = p[1] - pivot[1];
  return [pivot[0] + dx * Math.cos(a) - dy * Math.sin(a), pivot[1] + dx * Math.sin(a) + dy * Math.cos(a)];
};
const bezier = (pts: number[][], s: number): Vec => {
  const u = 1 - s;
  const [a, b, c, d] = pts;
  return [
    u * u * u * a[0] + 3 * u * u * s * b[0] + 3 * u * s * s * c[0] + s * s * s * d[0],
    u * u * u * a[1] + 3 * u * u * s * b[1] + 3 * u * s * s * c[1] + s * s * s * d[1],
  ];
};

/** Zoom của camera; mỗi lớp nhân thêm `depth` của nó để gần trôi nhanh, xa trôi chậm. */
const zoomAt = (t: number) => camera.zoom * sineInOut((t - camera.start) / (camera.end - camera.start));
const project = (p: Vec, depth: number, t: number): [number, number, number] => {
  const k = 1 + zoomAt(t) * depth;
  const [ox, oy] = camera.origin;
  return [ox + (p[0] - ox) * k, oy + (p[1] - oy) * k, k];
};

/**
 * Tư thế một cụm ở thời điểm `t` (null = chưa mở). `idle` là đồng hồ gió chạy
 * liên tục từ lúc mount, để cú mở nối tiếp đúng nhịp đung đưa đang dở.
 */
function groupPose(g: Group, t: number | null, idle: number) {
  const phase = t === null ? 0 : (t - g.start) / g.duration;
  const p = smoother(phase);
  /* Rotation đi sau vị trí một nhịp: cành bị đẩy thì gốc dời trước, ngọn quật theo. */
  const r = smoother(clamp(phase) ** 1.3);
  const sway = g.sway * Math.sin((2 * Math.PI * idle) / g.swayPeriod + g.pivot[0] * 0.01) * (1 - p);
  return {
    angle: g.rotation * r + sway,
    dx: g.delta[0] * p,
    dy: g.delta[1] * p,
    moving: Math.sin(Math.PI * clamp(phase)),
  };
}

/** Recoil của cành đậu khi chim bật đi: nhún xuống rồi dao động tắt dần. */
const perchRecoil = (t: number | null) => {
  if (t === null || t < bird.launch) return 0;
  const tau = t - bird.launch;
  return 2.6 * Math.exp(-4.2 * tau) * Math.sin((2 * Math.PI * tau) / 0.38);
};

function placeInGroup(item: { x: number; y: number }, groupName: string, t: number | null, idle: number) {
  const g = groups[groupName as keyof typeof groups];
  const pose = groupPose(g, t, idle);
  /* Cành đậu là một phần của cả hệ cành dưới, nên cú nhún lan ra cả cụm. */
  const extra = groupName === bird.group ? perchRecoil(t) : 0;
  const c = rotateAround([item.x, item.y], g.pivot as Vec, pose.angle + extra);
  return { center: [c[0] + pose.dx, c[1] + pose.dy] as Vec, angle: pose.angle + extra, moving: pose.moving, depth: g.depth };
}

/** Vị trí thế giới (trước camera) của một sprite. */
function itemWorld(item: Item, index: number, t: number | null, idle: number) {
  const placed = placeInGroup(item, item.group, t, idle);
  const flutterT = t ?? 0;
  const flutter =
    item.flutter * Math.sin(2 * Math.PI * 1.6 * flutterT + index * 1.7) * placed.moving +
    item.flutter * 0.12 * Math.sin((2 * Math.PI * idle) / (3.1 + (index % 4) * 0.7) + index);
  return { center: placed.center, rotation: item.rotation + placed.angle + flutter, depth: placed.depth };
}

const dropIndex = items.findIndex((item) => item.id === fruitDrop.item);

/** Quả nhỏ: lắc theo cành, đứt cuống, rơi có trọng lực, kế thừa vận tốc lúc đứt. */
function fruitWorld(item: Item, index: number, t: number | null, idle: number) {
  const hang = (time: number | null) => {
    const base = itemWorld(item, index, time, idle);
    if (time === null || time < fruitDrop.swing) return base;
    /* Cuống ở đỉnh quả: lắc như con lắc quanh điểm đó. */
    const tau = time - fruitDrop.swing;
    const swing = 14 * Math.sin((2 * Math.PI * tau) / 0.52) * Math.min(1, tau * 4);
    const stem = rotateAround([base.center[0], base.center[1] - (item.width * item.size[1]) / item.size[0] / 2], base.center, base.rotation);
    return { ...base, center: rotateAround(base.center, stem, swing), rotation: base.rotation + swing };
  };
  if (t === null || t < fruitDrop.release) return hang(t);
  const at = hang(fruitDrop.release);
  const before = hang(fruitDrop.release - 1 / 60);
  /* Cuống đứt thì quả chỉ mang theo một phần đà của cành, và không bao giờ bay lên:
     từ lúc rời cành chỉ còn trọng lực. */
  const vx = (at.center[0] - before.center[0]) * 60 * fruitDrop.inherit;
  const vy = Math.max(0, (at.center[1] - before.center[1]) * 60 * fruitDrop.inherit);
  const tau = t - fruitDrop.release;
  return {
    center: [at.center[0] + vx * tau, at.center[1] + vy * tau + 0.5 * fruitDrop.gravity * tau * tau] as Vec,
    rotation: at.rotation + fruitDrop.spin * tau,
    depth: at.depth,
  };
}

/** Một keyframe nhịp cánh: [pha, góc, scaleY]. Xuống nhanh (0,2→0,57), lên chậm. */
const WING_CYCLE: [number, number, number][] = [
  [0, 20, 0.82],
  [0.2, 44, 1.02],
  [0.4, 2, 0.94],
  [0.57, -62, 1],
  [0.76, -36, 0.8],
  [1, 20, 0.82],
];
/** Nội suy Catmull-Rom vòng — không gãy khúc ở các keyframe như nội suy thẳng. */
function wingAt(phase: number): [number, number] {
  const f = phase - Math.floor(phase);
  const n = WING_CYCLE.length - 1;
  let i = 0;
  while (i < n - 1 && f > WING_CYCLE[i + 1][0]) i++;
  const k = (j: number) => WING_CYCLE[((j % n) + n) % n];
  const p0 = k(i - 1);
  const p1 = WING_CYCLE[i];
  const p2 = WING_CYCLE[i + 1];
  const p3 = k(i + 2);
  const u = (f - p1[0]) / (p2[0] - p1[0]);
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
  return [cr(p0[1], p1[1], p2[1], p3[1]), cr(p0[2], p1[2], p2[2], p3[2])];
}

export function TropicalOpening({ backdrop }: { backdrop?: ReactNode }) {
  const { opened } = useExperience();
  const [ready, setReady] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const wingNearRef = useRef<HTMLDivElement>(null);
  const wingFarRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(opened);

  useEffect(() => {
    openedRef.current = opened;
  }, [opened]);

  useEffect(() => {
    const stage = stageRef.current;
    const artboard = artboardRef.current;
    if (!stage || !artboard) return;

    const sprites = [...stage.querySelectorAll<HTMLElement>("[data-item]")];
    const falling = [...stage.querySelectorAll<HTMLElement>("[data-leaf]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Dev: `?scene-t=1.4` đóng băng cảnh ở một khung. */
    const frozen =
      process.env.NODE_ENV !== "production"
        ? Number.parseFloat(new URLSearchParams(window.location.search).get("scene-t") ?? "")
        : Number.NaN;

    /* Đầu chim giật theo từng cú, giữ một nhịp rồi mới giật tiếp. */
    const head = { from: 0, to: 0, at: -1, next: 1.6 };
    const IDLE_LOOKS = [-4, 3, -1, 5, -3, 1];
    let lookIndex = 0;
    const headAngle = (now: number) => lerp(head.from, head.to, snap((now - head.at) / 0.14));
    const lookTo = (angle: number, now: number) => {
      head.from = headAngle(now);
      head.to = angle;
      head.at = now;
    };

    const draw = (t: number | null, idle: number, clock: number) => {
      sprites.forEach((node, i) => {
        const item = items[i];
        const w = i === dropIndex ? fruitWorld(item, i, t, idle) : itemWorld(item, i, t, idle);
        const [x, y, k] = project(w.center, w.depth, t ?? 0);
        node.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${w.rotation}deg) scale(${item.flipX ? -k : k}, ${k})`;
      });

      /* Giấy nhấc lên rồi tan: nó là nền bị dỡ đi, không phải hoạ tiết bị làm mờ. */
      const lift = t === null ? 0 : smoother((t - paper.lift[0]) / (paper.lift[1] - paper.lift[0]));
      if (paperRef.current) {
        paperRef.current.style.opacity = String(1 - lift);
        paperRef.current.style.transform = `translateY(${-18 * lift}px) scale(${1 + 0.04 * lift})`;
        paperRef.current.style.visibility = lift === 1 ? "hidden" : "";
      }
      const groundOpacity = t === null ? 1 : 1 - smoother((t - ground.fade[0]) / (ground.fade[1] - ground.fade[0]));
      if (groundRef.current) groundRef.current.style.opacity = String(groundOpacity);
      if (veilRef.current) veilRef.current.style.opacity = String(groundOpacity);

      drawBird(t, idle, clock);

      falling.forEach((node, i) => {
        const leaf = leaves[i];
        const tau = t === null ? -1 : t - leaf.at;
        if (tau < 0) {
          node.style.visibility = "hidden";
          return;
        }
        /* Lá rơi đạt vận tốc giới hạn rồi lượn: nghiêng theo hướng đang lượn, lật mặt theo nhịp. */
        const settle = 0.35;
        const fall = leaf.fall * (tau - settle * (1 - Math.exp(-tau / settle)));
        const swing = Math.sin((2 * Math.PI * tau) / leaf.period);
        const x = leaf.from[0] + leaf.drift * tau + leaf.sway * swing;
        const y = leaf.from[1] + fall;
        const [px, py, k] = project([x, y], 0.85, t ?? 0);
        const tilt = leaf.rotation + 30 * Math.cos((2 * Math.PI * tau) / leaf.period);
        const flip = 0.62 + 0.38 * Math.cos((4 * Math.PI * tau) / leaf.period);
        node.style.visibility = "";
        node.style.opacity = String(clamp(tau / 0.18));
        node.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) rotate(${tilt}deg) scale(${flip * k}, ${k})`;
      });
    };

    const drawBird = (t: number | null, idle: number, clock: number) => {
      const node = birdRef.current;
      if (!node) return;
      const feet: Vec = [bird.origin[0] + bird.feet[0], bird.origin[1] + bird.feet[1]];
      /* Trước khi bay, chim đứng trên cành nên đung đưa cùng cành. */
      const perched = placeInGroup({ x: feet[0], y: feet[1] }, bird.group, t !== null && t >= bird.launch ? null : t, idle);
      let pos: Vec = perched.center;
      let rotation = perched.angle;
      let sx = 1;
      let sy = 1 + 0.007 * Math.sin((2 * Math.PI * idle) / 2.6);
      let flapPhase = 0;
      let flying = false;

      if (t !== null) {
        const [c0, c1] = bird.crouch;
        if (t < bird.launch) {
          /* Hạ người lấy đà: chúi tới, nén xuống. */
          const crouch = smoother((t - c0) / (c1 - c0));
          rotation += 6 * crouch;
          sy *= 1 - 0.05 * crouch;
          sx *= 1 + 0.025 * crouch;
        } else {
          flying = true;
          const u = clamp((t - bird.launch) / (bird.flight.end - bird.launch));
          /* Bật đi đã có sẵn vận tốc rồi tăng dần — không khởi động từ số 0. */
          const s = u * (0.55 + 0.45 * u);
          const offset = bezier(bird.flight.path, s);
          pos = [feet[0] + offset[0], feet[1] + offset[1]];
          /* Bung khỏi tư thế nén trong ~0,1 s rồi vươn dài người, không nhảy khung. */
          const tau = t - bird.launch;
          const unCrouch = 1 - smoother(tau / 0.1);
          const stretch = Math.sin(Math.PI * clamp(tau / 0.26));
          sy = (1 + 0.05 * stretch) * (1 - 0.05 * unCrouch);
          sx = (1 - 0.03 * stretch) * (1 + 0.025 * unCrouch);
          rotation = lerp(6, bird.flight.bank, smoother(u * 2.2));
          const grow = 1 + bird.flight.grow * s;
          sx *= grow;
          sy *= grow;
          /* Pha 0,2 là đỉnh cánh lúc đứng lấy đà — cú bật mở đầu bằng một nhịp đập xuống. */
          flapPhase = 0.2 + tau / FLAP_PERIOD;
          /* Thân nhô lên trong cú đập xuống. */
          pos[1] += -9 * Math.sin(2 * Math.PI * (flapPhase - 0.2)) * Math.min(1, tau * 5);
        }
      }

      const [x, y, k] = project(pos, bird.depth, t ?? 0);
      node.style.transform = `translate(${x - bird.feet[0]}px, ${y - bird.feet[1]}px) rotate(${rotation}deg) scale(${sx * k}, ${sy * k})`;

      /* Đầu */
      if (t === null) {
        if (clock > head.next && !reduced) {
          lookTo(IDLE_LOOKS[lookIndex++ % IDLE_LOOKS.length], clock);
          head.next = clock + 2.2 + ((lookIndex * 0.73) % 1.6);
        }
      }
      if (headRef.current) headRef.current.style.transform = `rotate(${headAngle(clock)}deg)`;

      /* Cánh */
      const [w0, w1] = bird.wingsOpen;
      const open = t === null ? 0 : smoother((t - w0) / (w1 - w0));
      const wing = (el: HTMLDivElement | null, lag: number, amp: number) => {
        if (!el) return;
        if (open === 0) {
          el.style.visibility = "hidden";
          return;
        }
        const [angle, scaleY] = flying ? wingAt(flapPhase - lag) : wingAt(0.2 - lag);
        /* Từ tư thế xếp (dọc thân, ngả ra sau) bung dần về nhịp đập. */
        const a = lerp(-70, angle * amp, open);
        const s = lerp(0.45, 1, open);
        el.style.visibility = "";
        el.style.opacity = String(clamp(open * 3));
        el.style.transform = `rotate(${a}deg) scale(${s}, ${s * scaleY})`;
      };
      wing(wingNearRef.current, 0, 1);
      wing(wingFarRef.current, 0.06, 0.82);
    };

    /*
      Phóng cả artboard bằng một hệ số chung. Điện thoại dọc ra đúng "cover".
      Màn ngang thì trần hệ số đặt theo tờ giấy; khi đó nền kem tràn ra hai bên
      artboard (`.scene-veil`).
    */
    const fit = () => {
      const { clientWidth: w, clientHeight: h } = stage;
      const cover = Math.max(w / canvas.width, h / canvas.height);
      const scale = Math.min(cover, (PAPER_FILL * h) / paper.box.height);
      artboard.style.transform = `scale(${scale}) translate(-50%, -50%)`;

      const { box } = paper;
      stage.style.setProperty("--cover-x", `${w / 2 + (box.x + box.width / 2 - canvas.width / 2) * scale}px`);
      stage.style.setProperty("--cover-y", `${h / 2 + (box.y + box.height / 2 - canvas.height / 2) * scale}px`);
      stage.style.setProperty("--cover-w", `${box.width * scale}px`);
      stage.style.setProperty("--cover-h", `${box.height * scale}px`);
    };

    const resize = new ResizeObserver(fit);
    resize.observe(stage);
    fit();

    const mountedAt = performance.now();
    let openedAt: number | null = null;
    let lookStep = 0;
    let frame = 0;
    let done = false;

    const finish = () => {
      done = true;
      artboard.style.display = "none";
      for (const node of sprites) node.style.willChange = "auto";
    };

    /* Không có màn mở thiệp thì cảnh đã mở sẵn, không vẽ gì. */
    if (openedRef.current) {
      finish();
    } else {
      for (const node of sprites) node.style.willChange = "transform";
      draw(Number.isNaN(frozen) ? null : frozen, 0, 0);
    }

    const tick = (now: number) => {
      if (done) return;
      const clock = (now - mountedAt) / 1000;
      const idle = reduced ? 0 : clock;

      if (!Number.isNaN(frozen)) {
        draw(frozen, idle, clock);
      } else if (openedRef.current) {
        if (openedAt === null) {
          openedAt = now;
          if (reduced) {
            /* Không chuyển động: cả cảnh tan một lần qua transition của artboard. */
            artboard.style.opacity = "0";
            window.setTimeout(finish, 900);
            done = true;
            return;
          }
        }
        const t = (now - openedAt) / 1000;
        /* Hai cú ngoái đầu theo kịch bản: nhìn khách, rồi nhìn đường bay. */
        const look = bird.look[lookStep];
        if (look && t >= look[0]) {
          lookTo(look[1], clock);
          lookStep++;
        }
        draw(t, idle, clock);
        if (t >= scene.duration) {
          finish();
          return;
        }
      } else {
        draw(null, idle, clock);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    /* Đủ ảnh mới hiện cảnh và mở khoá nút. Đợi `load` chứ không đợi `decode()`:
       decode() treo vô hạn khi tab đang ẩn. Mạng chậm thì vẫn mở sau vài giây. */
    let cancelled = false;
    const images = [...stage.querySelectorAll("img")];
    const loaded = Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            if (image.complete) return resolve(undefined);
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
      ),
    );
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 6000));
    void Promise.race([loaded, timeout]).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
    };
  }, []);

  const wingStyle = (w: typeof bird.wings.near) => ({
    left: w.shoulder[0] - w.pivot[0],
    top: w.shoulder[1] - w.pivot[1],
    width: w.size[0],
    transformOrigin: `${w.pivot[0]}px ${w.pivot[1]}px`,
  });

  return (
    <div ref={stageRef} data-ready={ready} data-ground={ground.tone} className="scene-stage">
      {backdrop}
      <div
        ref={artboardRef}
        aria-hidden
        className="scene-artboard"
        style={{ width: canvas.width, height: canvas.height }}
      >
        <div className="scene-world">
          <div ref={veilRef} className="scene-veil" style={{ zIndex: 0 }} />
          <div ref={groundRef} className="scene-ground" style={{ zIndex: 1 }} />

          {/* Tờ giấy giữ đúng tỉ lệ của file, căn giữa theo chiều dọc artboard. */}
          <div
            ref={paperRef}
            className="scene-sprite"
            style={{ zIndex: paper.z, left: paper.rect[0], top: paper.rect[1], width: paper.rect[2] }}
          >
            <Image src={paper.asset} unoptimized alt="" width={paper.rect[2]} height={paper.rect[3]} loading="eager" />
          </div>

          {items.map((item) => (
            <div key={item.id} data-item className="scene-sprite" style={{ zIndex: item.z, width: item.width }}>
              <Image src={item.asset} unoptimized alt="" width={item.size[0]} height={item.size[1]} loading="eager" />
            </div>
          ))}

          {/* Con vẹt: một khung theo hệ toạ độ của ảnh gốc, gốc xoay ở chân. */}
          <div
            ref={birdRef}
            className="scene-rig"
            style={{
              zIndex: bird.z,
              width: bird.size[0],
              height: bird.size[1],
              transformOrigin: `${bird.feet[0]}px ${bird.feet[1]}px`,
            }}
          >
            <div ref={wingFarRef} className="scene-rig-part" style={wingStyle(bird.wings.far)}>
              <Image src={bird.wings.far.asset} unoptimized alt="" width={bird.wings.far.size[0]} height={bird.wings.far.size[1]} loading="eager" />
            </div>
            <div
              className="scene-rig-part"
              style={{ left: bird.body.rect[0], top: bird.body.rect[1], width: bird.body.rect[2] }}
            >
              <Image src={bird.body.asset} unoptimized alt="" width={bird.body.rect[2]} height={bird.body.rect[3]} loading="eager" />
            </div>
            <div ref={wingNearRef} className="scene-rig-part" style={wingStyle(bird.wings.near)}>
              <Image src={bird.wings.near.asset} unoptimized alt="" width={bird.wings.near.size[0]} height={bird.wings.near.size[1]} loading="eager" />
            </div>
            <div
              ref={headRef}
              className="scene-rig-part"
              style={{
                left: bird.head.rect[0],
                top: bird.head.rect[1],
                width: bird.head.rect[2],
                transformOrigin: `${bird.head.pivot[0] - bird.head.rect[0]}px ${bird.head.pivot[1] - bird.head.rect[1]}px`,
              }}
            >
              <Image src={bird.head.asset} unoptimized alt="" width={bird.head.rect[2]} height={bird.head.rect[3]} loading="eager" />
            </div>
          </div>

          {leaves.map((leaf, i) => (
            <div key={i} data-leaf className="scene-sprite" style={{ zIndex: 3200, width: leaf.width, visibility: "hidden" }}>
              <Image src={leaf.asset} unoptimized alt="" width={leaf.size[0]} height={leaf.size[1]} loading="eager" />
            </div>
          ))}
        </div>
      </div>

      {sections.includes("intro") ? <Intro ready={ready} /> : null}
    </div>
  );
}
