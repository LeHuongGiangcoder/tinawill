"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

import { OPEN_EVENT } from "@/components/ui/Motion";

/**
 * Tán lá nhiệt đới của màn mở thiệp — bố cục trang 1 trong bản Canva của
 * khách, dựng lại thành bốn tầng sâu thay vì một mảng phẳng.
 *
 * Trước khi mở: một vòng hoa quả ôm lấy tấm thiệp bầu dục ở giữa, bốn góc
 * được neo bằng tàu dương xỉ to và tối nhất. Bấm mở thiệp: từng tầng rẽ ra
 * hai bên theo thứ tự xa dần ống kính — tầng sát mặt người xem đi trước và đi
 * xa nhất, tán sâu nhất nhấc mình sau cùng. Đó là cách một cú máy đẩy xuyên
 * qua lùm cây, và là lý do cảnh không dạt sang hai bên cùng một lúc.
 *
 * Toạ độ là phần trăm trong khung 9/16 (.cover-9x16) nên bố cục giữ nguyên ở
 * mọi khổ màn — giống cách <GardenStage> và cảnh Venue đặt lớp.
 */

const BASE = "/tropical";

/**
 * Cỡ thật của từng file sau khi cắt sát viền — chép từ output của
 * `node scripts/tropical-assets.mjs`. Next cần đúng tỉ lệ để chừa chỗ trước
 * khi ảnh tải xong, nếu không thì cả vòng hoa quả nhảy một nhịp khi tải.
 *
 * Chạy lại script mà cỡ đổi thì sửa ở đây; gõ sai tên là TypeScript bắt được
 * ngay vì mọi `name` bên dưới đều tra vào bảng này.
 */
const SIZES = {
  "fern-frond": [1100, 1071],
  agave: [1100, 772],
  "banana-leaf": [363, 1100],
  "leaf-sprigs": [408, 720],
  "caladium-purple": [720, 695],
  "caladium-pink": [720, 694],
  hibiscus: [720, 665],
  heliconia: [497, 720],
  anthurium: [526, 720],
  "frangipani-branch": [720, 695],
  "frangipani-pair": [720, 516],
  frangipani: [717, 720],
  mango: [647, 720],
  pineapple: [448, 720],
  papaya: [675, 720],
  pear: [560, 720],
  grapes: [536, 720],
  "pomegranate-half": [583, 720],
  pomegranate: [578, 720],
} as const;

type PieceName = keyof typeof SIZES;

/**
 * Bốn tầng sâu, xếp từ gần ống kính nhất tới xa nhất.
 *
 *   delay   bắt đầu rẽ ở mốc nào của cú mở (0–1). Gần thì đi trước.
 *   travel  trượt ngang bao nhiêu % bề rộng khung. Gần thì đi xa hơn.
 *   scale   phình ra bao nhiêu khi lướt qua ống kính — chính cái này tạo
 *           chiều sâu: tầng gần lớn nhanh, tán sâu gần như đứng yên.
 *   z       thứ tự chồng lớp.
 *
 * `travel` của cả bốn tầng đều đủ để lá ra hẳn khỏi khung trước khi màn mở
 * thiệp tháo khỏi DOM; chênh nhau là để mắt đọc ra tầng nào gần tầng nào xa.
 */
const BANDS = {
  near: { delay: 0, travel: 158, scale: 1.5, z: 40 },
  fruit: { delay: 0.1, travel: 124, scale: 1.3, z: 30 },
  leaves: { delay: 0.2, travel: 104, scale: 1.17, z: 20 },
  canopy: { delay: 0.32, travel: 86, scale: 1.07, z: 10 },
} as const;

type BandName = keyof typeof BANDS;

type Piece = {
  /** Tên file trong public/tropical, bỏ đuôi */
  name: PieceName;
  /** Tâm x, tâm y và bề rộng — % của khung 9/16 */
  at: [x: number, y: number, width: number];
  rotate?: number;
  /** Lật ngang, để một tàu lá dùng được cho cả hai mép khung */
  flip?: boolean;
  /** Rẽ về phía nào. Bỏ trống thì theo nửa khung mà nó đang đứng. */
  side?: -1 | 1;
  /**
   * Gác lên tấm thiệp thay vì nằm dưới. Vài cánh hoa và quả đè lên mép bầu
   * dục đúng như bản Canva — nhờ đó tấm thiệp nằm TRONG lùm cây chứ không
   * dán lên trên nó. Vẫn rẽ cùng nhịp với tầng của mình.
   */
  over?: boolean;
  /** Lắc lư nhẹ như đang có gió */
  sway?: boolean;
};

/**
 * Tán sâu nhất: dương xỉ và dứa dại neo bốn góc cùng hai mép dài, tối màu và
 * to nhất khung. Chúng làm nên cái vòm tối ôm quanh tấm thiệp — chỗ sáng duy
 * nhất của màn hình nhờ vậy rơi đúng vào giữa.
 */
const CANOPY: Piece[] = [
  { name: "fern-frond", at: [4, 6, 74], rotate: 18 },
  { name: "fern-frond", at: [97, 8, 72], rotate: -18, flip: true },
  { name: "fern-frond", at: [3, 94, 76], rotate: -22 },
  { name: "fern-frond", at: [98, 90, 70], rotate: 22, flip: true },
  { name: "fern-frond", at: [-6, 50, 54], rotate: -72 },
  { name: "fern-frond", at: [106, 52, 52], rotate: 72, flip: true },
  { name: "agave", at: [52, 0, 64], rotate: 180 },
  { name: "agave", at: [46, 100, 68], rotate: 4 },
  /* Bốn tàu lấp hai đường chéo. Không có chúng thì giữa vòm và vòng hoa quả
     hở ra hai mảng trống, và nền rừng phía sau lộ thành hai vệt phẳng. */
  { name: "fern-frond", at: [26, 32, 66], rotate: 55, side: -1 },
  { name: "fern-frond", at: [76, 70, 64], rotate: -125, side: 1 },
  { name: "agave", at: [10, 72, 56], rotate: -30 },
  { name: "agave", at: [90, 28, 54], rotate: 150 },
];

/**
 * Tầng lá giữa: lá chuối và lá môn tím hồng, cỡ vừa. Chúng lấp khoảng trống
 * giữa vòm tối bên ngoài và vòng hoa quả bên trong, để hai tầng kia không
 * dính vào nhau thành một mảng.
 */
const LEAVES: Piece[] = [
  { name: "banana-leaf", at: [20, 20, 22], rotate: 38, sway: true },
  { name: "banana-leaf", at: [80, 18, 21], rotate: -44, sway: true },
  { name: "banana-leaf", at: [6, 60, 20], rotate: -12 },
  { name: "banana-leaf", at: [94, 62, 19], rotate: 16 },
  { name: "banana-leaf", at: [38, 94, 23], rotate: 168 },
  { name: "caladium-purple", at: [28, 12, 19], rotate: -16 },
  { name: "caladium-pink", at: [80, 86, 20], rotate: 22 },
  { name: "leaf-sprigs", at: [66, 6, 16], rotate: 10, sway: true },
];

/**
 * Vòng hoa quả ôm tấm thiệp, đọc theo mặt đồng hồ quanh hình bầu dục.
 *
 * Sắc nóng (xoài, mỏ két, dứa, dâm bụt) dồn về nửa trái, sắc đỏ thẫm và tím
 * (hồng môn, lựu, nho) về nửa phải, hoa sứ trắng đặt đúng đỉnh — nhờ vậy mắt
 * chạy vòng quanh thiệp thay vì vấp vào từng vật một. Bản Canva rải màu đều
 * khắp khung, và đó là chỗ nó trông lộn xộn.
 */
const FRUIT: Piece[] = [
  { name: "frangipani-branch", at: [52, 15, 24], rotate: -6, sway: true },
  { name: "grapes", at: [76, 10, 16] },
  { name: "anthurium", at: [90, 26, 17], rotate: 12 },
  { name: "pear", at: [92, 48, 16], over: true },
  { name: "pomegranate-half", at: [88, 68, 19], over: true },
  { name: "frangipani-pair", at: [62, 30, 17], rotate: -12, over: true },
  { name: "pomegranate", at: [74, 88, 14] },
  { name: "papaya", at: [46, 92, 27], rotate: -8 },
  { name: "hibiscus", at: [16, 86, 25] },
  { name: "pineapple", at: [6, 68, 17] },
  { name: "heliconia", at: [4, 44, 18], rotate: -10, sway: true },
  { name: "mango", at: [12, 22, 28], sway: true },
  { name: "frangipani", at: [27, 74, 11], rotate: 8, over: true },
];

/**
 * Tầng sát ống kính: ba vật cỡ lớn cố tình đặt lọt một nửa ra ngoài khung.
 * Chúng là cái rẽ đầu tiên và lướt đi nhanh nhất, nên khách đọc ra ngay rằng
 * cảnh có chiều sâu chứ không phải một tấm hình bị kéo sang hai bên.
 */
const NEAR: Piece[] = [
  { name: "hibiscus", at: [-4, 92, 36], rotate: -12 },
  { name: "fern-frond", at: [100, -6, 66], rotate: 28, flip: true },
  { name: "caladium-pink", at: [104, 78, 28], rotate: 25 },
];

const PIECES: Record<BandName, Piece[]> = {
  canopy: CANOPY,
  leaves: LEAVES,
  fruit: FRUIT,
  near: NEAR,
};

const BAND_NAMES = Object.keys(BANDS) as BandName[];

/** Vật đứng gần giữa khung quá thì không có "nửa khung" rõ ràng — ép một bên. */
const sideOf = (piece: Piece) => piece.side ?? (piece.at[0] < 50 ? -1 : 1);

export function TropicalCanopy() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const planes = gsap.utils.toArray<HTMLElement>("[data-canopy-plane]", root);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Một con số duy nhất điều khiển cả cảnh: 0 = lá che kín, 1 = đã rẽ hết. */
    const scene = { progress: 0 };

    const draw = () => {
      for (const plane of planes) {
        const delay = Number(plane.dataset.delay);
        const travel = Number(plane.dataset.travel);
        const scale = Number(plane.dataset.scale);
        const side = Number(plane.dataset.side);

        /* Mỗi tầng chạy trên quãng còn lại của cú mở, nên tầng xa khởi hành
           muộn mà vẫn về đích cùng lúc — không tầng nào bị bỏ lại trong khung
           khi màn mở thiệp tháo đi. */
        const t = Math.min(1, Math.max(0, (scene.progress - delay) / (1 - delay)));
        /* Luỹ thừa > 1: lá rời đi mỗi lúc một nhanh, như vật lướt qua ống
           kính. Tuyến tính thì trông như một tấm bìa bị kéo ngang. */
        const eased = Math.pow(t, 1.55);

        plane.style.transform = `translate(${side * eased * travel}%, 0) scale(${
          1 + (scale - 1) * eased
        })`;
      }
    };

    const onOpen = () => {
      if (reduce) {
        scene.progress = 1;
        draw();
        return;
      }
      gsap.to(scene, {
        progress: 1,
        duration: 2.3,
        ease: "none",
        onUpdate: draw,
        onComplete: () => {
          for (const plane of planes) plane.style.willChange = "auto";
        },
      });
    };

    window.addEventListener(OPEN_EVENT, onOpen);
    draw();

    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="cover-9x16">
        {BAND_NAMES.map((band) =>
          /*
            Mỗi tầng tách thành mặt phẳng trái / phải, và tách thêm lần nữa
            cho những vật gác lên tấm thiệp. Cả một mặt phẳng dùng chung một
            transform, nên cú mở chỉ phải vẽ lại hơn chục nút thay vì ba mươi
            mấy — và vì `scale` lấy tâm khung làm gốc, lá còn nở ra khỏi giữa
            chứ không chỉ trượt ngang.
          */
          ([-1, 1] as const).flatMap((side) =>
            [false, true].map((over) => {
              const pieces = PIECES[band].filter(
                (piece) => sideOf(piece) === side && Boolean(piece.over) === over,
              );
              if (pieces.length === 0) return null;

              return (
                <div
                  key={`${band}-${side}-${over}`}
                  data-canopy-plane
                  data-delay={BANDS[band].delay}
                  data-travel={BANDS[band].travel}
                  data-scale={BANDS[band].scale}
                  data-side={side}
                  style={{
                    position: "absolute",
                    inset: 0,
                    /* +8 đủ để vượt qua tấm thiệp (z 35) mà chưa chạm tầng kế trên. */
                    zIndex: BANDS[band].z + (over ? 8 : 0),
                    willChange: "transform",
                  }}
                >
                  {pieces.map((piece, i) => (
                    <div
                      key={`${piece.name}-${i}`}
                      style={{
                        position: "absolute",
                        left: `${piece.at[0]}%`,
                        top: `${piece.at[1]}%`,
                        width: `${piece.at[2]}%`,
                        transform: `translate(-50%, -50%) rotate(${piece.rotate ?? 0}deg)${
                          piece.flip ? " scaleX(-1)" : ""
                        }`,
                      }}
                    >
                      <div className={piece.sway ? "origin-bottom animate-sway" : undefined}>
                        <Image
                          src={`${BASE}/${piece.name}.webp`}
                          unoptimized
                          alt=""
                          width={SIZES[piece.name][0]}
                          height={SIZES[piece.name][1]}
                          priority={band === "canopy" || band === "fruit"}
                          sizes="80vw"
                          className="h-auto w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            }),
          ),
        )}
      </div>
    </div>
  );
}
