"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

import { OPEN_EVENT } from "@/components/ui/Motion";

/**
 * Khu vườn nhiệt đới của Tina & Will — một cảnh duy nhất dùng cho cả màn mở
 * thiệp lẫn hero, đúng như bộ asset khách gửi yêu cầu
 * (public/brand/elements/ANIMATION-GUIDE.md).
 *
 * Trạng thái 0: lá chuối và lá cọ che kín giữa khung — đó là nền của màn mở
 * thiệp. Trạng thái 1: lá trượt ra hai mép, cụm hoa quả lùi về bờ, mặt nước
 * lộ ra cùng phao và hoa đăng — đó là hero.
 *
 * Một cảnh, hai trạng thái, không đổi giữa hai ảnh đã flatten: chỉ transform
 * của từng lớp thay đổi. Cú chạm "Open invitation" bắn OPEN_EVENT và cảnh
 * chuyển từ 0 sang 1.
 *
 * Toạ độ là phần trăm trong khung 9/16 nên cảnh giữ nguyên bố cục ở mọi bề
 * rộng màn hình; khung đó được phóng kiểu "cover" bằng class .cover-9x16.
 */

/*
 * Bộ asset gốc khách gửi là PNG ~33MB (assets-source/garden, ngoài git) —
 * không thể bắt khách tải từng đó trên 4G. Bản dùng thật là WebP đã nén
 * trong public/garden, dựng lại bằng `node scripts/garden-assets.mjs`.
 *
 * Không để trong public/brand: thư mục đó bị `npm run assets` xoá và dựng
 * lại từ brand/ trước mỗi lần build.
 *
 * Ảnh đã đúng cỡ hiển thị nên để `unoptimized`: cho Next tối ưu lại 16 lớp
 * này chỉ thêm một vòng encode mà không giảm thêm byte nào.
 */
const BASE = "/garden";

type Layer = {
  /** Tên file trong bộ asset, bỏ đuôi .png */
  name: string;
  /** Kích thước thật của file — Image cần để giữ đúng tỉ lệ */
  w: number;
  h: number;
  /** Vị trí và bề rộng (%) ở trạng thái intro */
  from: [x: number, y: number, width: number];
  /** …và ở trạng thái hero */
  to: [x: number, y: number, width: number];
  z: number;
  /** Nằm trên mặt nước: chỉ hiện khi lá đã mở đủ để thấy nước */
  water?: boolean;
  /** Lắc lư nhẹ như đang có gió */
  sway?: boolean;
};

/** Cụm cây bờ trái/phải, hoa và quả. Rút về hai mép khi mở thiệp. */
const LAYERS: Layer[] = [
  { name: "foliage-left", w: 941, h: 1672, from: [31, 50, 108], to: [1, 50, 62], z: 4 },
  { name: "foliage-right", w: 941, h: 1672, from: [69, 50, 108], to: [99, 50, 62], z: 4 },
  { name: "float", w: 1308, h: 1202, from: [53, 65, 25], to: [52, 82, 22], z: 2, water: true },
  { name: "lantern", w: 1306, h: 1205, from: [28, 24, 10], to: [26, 24, 9], z: 2, water: true },
  { name: "lantern", w: 1306, h: 1205, from: [76, 43, 10], to: [78, 43, 9], z: 2, water: true },
  { name: "lantern", w: 1306, h: 1205, from: [26, 76, 10], to: [25, 76, 9], z: 2, water: true },
  { name: "mango", w: 1244, h: 1264, from: [83, 12, 40], to: [98, 12, 36], z: 8, sway: true },
  { name: "heliconia", w: 1024, h: 1536, from: [13, 26, 32], to: [1, 29, 28], z: 9 },
  { name: "pineapple", w: 1024, h: 1536, from: [13, 55, 25], to: [1, 57, 22], z: 7 },
  { name: "hibiscus", w: 1316, h: 1195, from: [16, 67, 39], to: [1, 69, 34], z: 10 },
  { name: "orchid", w: 1312, h: 1199, from: [88, 38, 31], to: [99, 39, 29], z: 10, sway: true },
  { name: "orchid", w: 1312, h: 1199, from: [87, 73, 30], to: [99, 73, 27], z: 10 },
  { name: "papaya", w: 1536, h: 1024, from: [23, 86, 45], to: [7, 88, 36], z: 11 },
  { name: "frangipani", w: 1374, h: 1145, from: [7, 83, 30], to: [0, 85, 28], z: 12 },
  { name: "pomegranate", w: 1233, h: 1275, from: [81, 87, 35], to: [96, 88, 33], z: 11 },
  { name: "grapes", w: 1312, h: 1199, from: [62, 95, 34], to: [81, 99, 31], z: 12 },
];

type Curtain = {
  name: string;
  w: number;
  h: number;
  /** Vị trí và bề rộng (%) — màn lá đứng yên, chỉ trượt ngang khi mở */
  at: [x: number, y: number, width: number];
  /** -1 trượt sang trái, 1 sang phải */
  side: -1 | 1;
  rotate: number;
};

/** Màn lá che giữa khung ở intro. Trượt hẳn ra khỏi khung khi mở thiệp. */
const CURTAINS: Curtain[] = [
  { name: "banana-leaf", w: 1536, h: 1024, at: [38, 8, 110], side: -1, rotate: -24 },
  { name: "palm-frond", w: 1536, h: 1024, at: [60, 23, 108], side: 1, rotate: 20 },
  { name: "banana-leaf", w: 1536, h: 1024, at: [38, 38, 115], side: -1, rotate: 8 },
  { name: "palm-frond", w: 1536, h: 1024, at: [62, 53, 115], side: 1, rotate: -10 },
  { name: "banana-leaf", w: 1536, h: 1024, at: [35, 68, 108], side: -1, rotate: 5 },
  { name: "banana-leaf", w: 1536, h: 1024, at: [62, 87, 114], side: 1, rotate: -24 },
];

const CURTAIN_TRAVEL = 108;
const CURTAIN_SPIN = 18;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function GardenStage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nodes = gsap.utils.toArray<HTMLElement>("[data-garden-layer]", root);
    const curtains = gsap.utils.toArray<HTMLElement>("[data-garden-curtain]", root);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Một con số duy nhất điều khiển cả cảnh: 0 = intro, 1 = hero. */
    const scene = { progress: 0 };

    const draw = () => {
      const p = scene.progress;

      for (const node of nodes) {
        const from = JSON.parse(node.dataset.from ?? "[0,0,0]") as number[];
        const to = JSON.parse(node.dataset.to ?? "[0,0,0]") as number[];
        node.style.left = `${lerp(from[0], to[0], p)}%`;
        node.style.top = `${lerp(from[1], to[1], p)}%`;
        node.style.width = `${lerp(from[2], to[2], p)}%`;
        /* Phao và hoa đăng chỉ hiện khi lá đã mở đủ để thấy mặt nước. */
        if (node.dataset.water) {
          node.style.opacity = String(Math.max(0, (p - 0.25) / 0.75));
        }
      }

      for (const node of curtains) {
        const side = Number(node.dataset.side);
        const rotate = Number(node.dataset.rotate);
        node.style.transform = `translate(calc(-50% + ${side * p * CURTAIN_TRAVEL}%), -50%) rotate(${
          rotate + side * p * CURTAIN_SPIN
        }deg)`;
      }
    };

    const ctx = gsap.context(() => {
      if (reduce) return;

      /* Phao trôi lững lờ, hoa đăng dập dềnh — mỗi cái một nhịp khác nhau nên
         mặt nước không trông như một khối cứng dịch chuyển cùng lúc. */
      for (const node of gsap.utils.toArray<HTMLElement>("[data-garden-drift]", root)) {
        const i = Number(node.dataset.gardenDrift);
        gsap.to(node, {
          yPercent: i % 2 ? 3 : -3,
          xPercent: i % 3 ? 1.5 : -1.5,
          rotate: i % 2 ? 3 : -3,
          duration: 6 + i * 0.9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, root);

    const onOpen = () => {
      if (reduce) {
        scene.progress = 1;
        draw();
        return;
      }
      gsap.to(scene, {
        progress: 1,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: draw,
        onComplete: () => {
          for (const node of [...nodes, ...curtains]) node.style.willChange = "auto";
        },
      });
    };

    window.addEventListener(OPEN_EVENT, onOpen);
    draw();

    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="cover-9x16">
        <Image
          src={`${BASE}/water.webp`}
          unoptimized
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {LAYERS.map((layer, i) => (
          <div
            key={`${layer.name}-${i}`}
            data-garden-layer
            data-from={JSON.stringify(layer.from)}
            data-to={JSON.stringify(layer.to)}
            data-water={layer.water ? "1" : undefined}
            style={{
              position: "absolute",
              left: `${layer.from[0]}%`,
              top: `${layer.from[1]}%`,
              width: `${layer.from[2]}%`,
              transform: "translate(-50%, -50%)",
              zIndex: layer.z,
              opacity: layer.water ? 0 : 1,
              willChange: "left, top, width",
            }}
          >
            <div
              data-garden-drift={layer.water ? i : undefined}
              className={layer.sway ? "origin-bottom animate-sway" : undefined}
            >
              <Image
                src={`${BASE}/${layer.name}.webp`}
                unoptimized
                alt=""
                width={layer.w}
                height={layer.h}
                priority={i < 4}
                sizes="60vw"
                className="h-auto w-full"
              />
              {/* Vòng gợn quanh phao là lớp riêng của web, không gắn vào ảnh phao */}
              {layer.name === "float" ? (
                <>
                  <span className="ripple" />
                  <span className="ripple ripple-late" />
                </>
              ) : null}
            </div>
          </div>
        ))}

        {CURTAINS.map((curtain, i) => (
          <div
            key={`${curtain.name}-${i}`}
            data-garden-curtain
            data-side={curtain.side}
            data-rotate={curtain.rotate}
            style={{
              position: "absolute",
              left: `${curtain.at[0]}%`,
              top: `${curtain.at[1]}%`,
              width: `${curtain.at[2]}%`,
              transform: `translate(-50%, -50%) rotate(${curtain.rotate}deg)`,
              zIndex: 20,
              willChange: "transform",
            }}
          >
            <Image
              src={`${BASE}/${curtain.name}.webp`}
              unoptimized
              alt=""
              width={curtain.w}
              height={curtain.h}
              priority
              sizes="120vw"
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
