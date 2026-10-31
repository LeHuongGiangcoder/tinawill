"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { Intro } from "@/components/sections/Intro";
import { sections } from "@/content/client";
import scene from "@/content/reveal-scene.json";

/**
 * Cảnh reveal của Tina & Will — một artboard duy nhất cho cả màn mở thiệp lẫn
 * hero. Đóng: tán lá che kín, tờ giấy nằm giữa. Mở: camera hạ dần qua từng tầng
 * lá trong 5 giây xuống mặt sông, nước và vật nổi trôi mãi không dừng.
 *
 * Toạ độ, thứ tự lớp và nhịp mở của từng lá đều đọc từ content/reveal-scene.json
 * (sinh bằng `node scripts/reveal-assets.mjs`), không đặt tay. Công thức chuyển
 * động theo đúng public/tropical-reveal-package/ANIMATION-GUIDE.vi.md.
 *
 * Reveal và vật nổi chạy chung một vòng requestAnimationFrame trên style trực
 * tiếp thay vì GSAP: 36 lớp, mỗi lớp một quỹ đạo tính theo manifest. Nước là
 * CSS animation (`.scene-belt`), nên hai đồng hồ không dính vào nhau và nước
 * vẫn chảy sau khi reveal xong.
 */

const { canvas, camera, ground, paper, elements, floaters, revealDuration } = scene;

/** Tờ giấy chiếm tối đa chừng này chiều cao màn — xem `fit` bên dưới. */
const PAPER_FILL = 0.92;

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** smootherstep: vận tốc và gia tốc về 0 ở hai đầu, không giật lúc bắt đầu. */
const ease = (t: number) => {
  const u = clamp(t);
  return u * u * u * (u * (u * 6 - 15) + 10);
};

/** Bề rộng dựng thật của sprite; phần còn lại là `scale` để không reflow mỗi khung hình. */
const baseWidth = (e: (typeof elements)[number]) => Math.max(e.closed.width, e.open.width);

export function TropicalReveal() {
  const { opened } = useExperience();
  const [ready, setReady] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const beltRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(opened);

  useEffect(() => {
    openedRef.current = opened;
  }, [opened]);

  useEffect(() => {
    const stage = stageRef.current;
    const artboard = artboardRef.current;
    const world = worldRef.current;
    const belt = beltRef.current;
    if (!stage || !artboard || !world || !belt) return;

    const sprites = [...stage.querySelectorAll<HTMLElement>("[data-sprite]")];
    const drifters = [...stage.querySelectorAll<HTMLElement>("[data-floater]")];
    const ripples = [...stage.querySelectorAll<HTMLElement>("[data-ripple]")];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const depth = reduced ? 0.15 : 1;
    const drift = reduced ? 0.12 : 1;

    const drawReveal = (progress: number) => {
      const seconds = clamp(progress) * revealDuration;

      const cameraT = ease((seconds - camera.start) / camera.duration) * (reduced ? 0.2 : 1);
      world.style.transform = `translate3d(0, ${camera.offsetY * cameraT}px, 0) scale(${lerp(camera.scaleFrom, camera.scaleTo, cameraT)})`;

      elements.forEach((e, i) => {
        const node = sprites[i];
        const t = ease((seconds - e.reveal.delay) / e.reveal.duration);
        const lift = Math.sin(Math.PI * t) * depth;
        const { closed: a, open: b, motion: m } = e;
        const x = lerp(a.x, b.x, t) + m.arcX * lift;
        const y = lerp(a.y, b.y, t) + m.arcY * lift;
        const size = (lerp(a.width, b.width, t) * (1 + m.liftScale * lift)) / baseWidth(e);
        const rotation = lerp(a.rotation, b.rotation, t) + m.bend * lift;
        const opacity = lerp(a.opacity, b.opacity, t);
        node.style.opacity = String(opacity);
        node.style.visibility = opacity === 0 ? "hidden" : "";
        node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotation}deg) scale(${a.flipX ? -size : size}, ${size})`;
      });

      /* Hai lớp này tan theo cú mở: nền tán lá rồi tới tờ giấy. Chúng là nền
         bị dỡ đi để lộ mặt sông, không phải hoạ tiết bị làm mờ cho chìm xuống. */
      const groundOpacity = 1 - ease((seconds - ground.fadeStart) / (ground.fadeEnd - ground.fadeStart));
      if (groundRef.current) groundRef.current.style.opacity = String(groundOpacity);
      if (veilRef.current) veilRef.current.style.opacity = String(groundOpacity);

      const paperT = ease((seconds - paper.fadeStart) / (paper.fadeEnd - paper.fadeStart));
      if (paperRef.current) {
        paperRef.current.style.opacity = String(1 - paperT);
        paperRef.current.style.transform = `translateY(${-12 * paperT}px)`;
      }
    };

    const drawAmbient = (t: number) => {
      floaters.forEach((f, i) => {
        const m = f.drift;
        const w = (2 * Math.PI) / m.period;
        // Hai tần số lệch nhau để bốn vật không nhấp nhô đồng loạt.
        const dx = drift * m.amplitudeX * (Math.sin(w * t + m.phase) + 0.22 * Math.sin(0.43 * w * t + 1.7 * m.phase));
        const dy = drift * m.amplitudeY * (Math.cos(0.81 * w * t + m.phase) + 0.18 * Math.sin(0.37 * w * t + 0.8));
        const rotation = drift * m.rotation * Math.sin(0.63 * w * t + m.phase + 0.6);
        drifters[i].style.transform = `translate3d(${f.x + dx}px, ${f.y + dy}px, 0) translate(-50%, -50%) rotate(${rotation}deg)`;

        const wave = (t / f.ripple.period + m.phase / (2 * Math.PI)) % 1;
        // Gợn nước lan ra rồi tan — chuyển động của nước, không phải hoạ tiết.
        ripples[i].style.opacity = String(0.5 * Math.sin(Math.PI * wave) ** 2);
        ripples[i].style.transform = `translate3d(${f.ripple.x + dx * 0.65}px, ${f.ripple.y + dy * 0.65}px, 0) translate(-50%, -50%) scale(${1 + 0.13 * wave * drift})`;
      });
    };

    /*
      Phóng cả artboard bằng một hệ số chung. Điện thoại dọc ra đúng "cover" của
      manifest. Màn ngang mà cover thì 9:16 phóng to gấp đôi màn và tờ giấy tràn
      khỏi khung, nên trần hệ số đặt theo tờ giấy; khi đó nước và nền lá tràn
      ra hai bên artboard (`.scene-water`, `.scene-veil`).
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

    /* Không có màn mở thiệp thì hero đứng sẵn ở trạng thái mở, không chạy reveal. */
    let progress = openedRef.current ? 1 : 0;
    let revealStart: number | null = null;
    let onScreen = true;
    let ambient = 0;
    let last = performance.now();
    let frame = 0;

    const setLayerHint = (value: string) => {
      world.style.willChange = value;
      for (const node of sprites) node.style.willChange = value;
    };

    drawReveal(progress);
    drawAmbient(0);

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;

      if (openedRef.current && progress < 1) {
        if (revealStart === null) {
          revealStart = now;
          setLayerHint("transform");
        }
        progress = clamp((now - revealStart) / (revealDuration * 1000));
        drawReveal(progress);
        if (progress === 1) setLayerHint("auto");
      }

      if (onScreen && !document.hidden) {
        ambient += dt;
        drawAmbient(ambient);
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    /* Cuộn qua hero rồi thì thôi vẽ — pin điện thoại của khách. */
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      belt.style.animationPlayState = onScreen ? "running" : "paused";
    });
    visibility.observe(stage);

    /* Đủ ảnh mới hiện cảnh và mở khoá nút, để lúc lá trượt không hở lỗ. Đợi
       `load` chứ không đợi `decode()`: decode() treo vô hạn khi tab đang ẩn.
       Mạng quá chậm thì vẫn mở sau vài giây, không kẹt khách. */
    let cancelled = false;
    const water = new window.Image();
    water.src = scene.water.asset;
    const images = [water, ...stage.querySelectorAll("img")];
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
      visibility.disconnect();
    };
  }, []);

  return (
    <div ref={stageRef} data-ready={ready} className="scene-stage">
      <div
        ref={artboardRef}
        aria-hidden
        className="scene-artboard"
        style={{ width: canvas.width, height: canvas.height }}
      >
        <div
          ref={worldRef}
          className="scene-world"
          style={{ transformOrigin: `${camera.origin[0]}px ${camera.origin[1]}px` }}
        >
          <div className="scene-water">
            <div
              ref={beltRef}
              className="scene-belt"
              style={{ "--scene-water-period": `${scene.water.period}s` } as CSSProperties}
            />
          </div>

          <div ref={veilRef} className="scene-veil" style={{ zIndex: ground.z - 1 }} />

          <div ref={groundRef} className="scene-plate" style={{ zIndex: ground.z }}>
            <Image src={ground.asset} unoptimized alt="" width={canvas.width} height={canvas.height} loading="eager" />
          </div>
          <div ref={paperRef} className="scene-plate" style={{ zIndex: paper.z }}>
            <Image src={paper.asset} unoptimized alt="" width={canvas.width} height={canvas.height} loading="eager" />
          </div>

          {elements.map((e) => (
            <div
              key={e.id}
              data-sprite
              className="scene-sprite"
              style={{ zIndex: e.z, width: baseWidth(e) }}
            >
              <Image
                src={e.asset}
                unoptimized
                alt=""
                width={e.rawSize[0]}
                height={e.rawSize[1]}
                loading="eager"
              />
            </div>
          ))}

          {floaters.map((f) => (
            <div key={f.id}>
              <div
                data-ripple
                className="scene-sprite"
                style={{ zIndex: f.z - 1, width: f.ripple.width }}
              >
                <Image
                  src={f.ripple.asset}
                  unoptimized
                  alt=""
                  width={f.ripple.width}
                  height={f.ripple.height}
                  loading="eager"
                />
              </div>
              <div data-floater className="scene-sprite" style={{ zIndex: f.z, width: f.width }}>
                <Image src={f.asset} unoptimized alt="" width={f.width} height={f.height} loading="eager" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {sections.includes("intro") ? <Intro ready={ready} /> : null}
    </div>
  );
}
