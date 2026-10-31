import Image from "next/image";

import type { DriftPlacement, HangPlacement, SprigPlacement } from "@/content/client";
import { element } from "@/lib/assets";

/*
  Hai kiểu hoạ tiết rời đặt TRONG một khung có `container-type: inline-size`
  (ví dụ `.page-frame`), nên mọi số đo là `cqw` — phần trăm bề rộng của khung —
  chứ không phải của màn hình. Khác `Decor` ở chỗ đó: Decor đặt theo cả
  section, còn hai cái này bám theo một tờ giấy đã bị chặn bề rộng.

  Như Decor: luôn `aria-hidden`, không bắt chuột, `opacity` giữ nguyên 1.
*/

/**
 * Một đèn lồng treo từ mép trên của khung.
 *
 * File đèn trong brand/elements đã kéo dài sợi dây lên phía trên (xem
 * scripts/love-story-assets.mjs), nên chỉ cần nói đèn nằm ở đâu: `hang` là
 * toạ độ dọc của chóp tua, tính từ mép trên khung. Dây dài ra hay ngắn đi
 * theo `hang`, phần dây thừa bị lớp bọc cắt ở mép trên.
 *
 * Đèn đung đưa như quả lắc quanh đầu dây, rất nhẹ: góc lắc tự nhỏ đi khi dây
 * dài, để đèn treo thấp không văng ra xa hơn đèn treo cao.
 */
export function Hung({ name, left, hang, width, swing = 10, delay = 0 }: HangPlacement) {
  const art = element(name);
  if (!art?.width || !art.height) return null;
  const height = (width * art.height) / art.width;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute origin-top animate-hang select-none"
      style={
        {
          left: `${left - width / 2}cqw`,
          top: `${hang - height}cqw`,
          width: `${width}cqw`,
          animationDuration: `${swing}s`,
          animationDelay: `-${delay}s`,
          // Đẩy chóp tua đi tối đa ~0.8cqw dù dây dài hay ngắn: nhẹ như gió thoảng.
          "--swing-deg": `${Math.min(1.2, 45 / hang)}deg`,
        } as React.CSSProperties
      }
    >
      <Image src={art.src} alt="" width={art.width} height={art.height} sizes="30rem" className="h-auto w-full" />
    </span>
  );
}

/** Một vật nổi trên mặt nước, trôi nhè nhẹ tại chỗ. `left`/`top` là tâm vật. */
export function Drifter({ name, left, top, width, x = 2, y = 0.8, deg = 3, period = 12, delay = 0 }: DriftPlacement) {
  const art = element(name);
  if (!art?.width || !art.height) return null;
  const height = (width * art.height) / art.width;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute animate-drift select-none"
      style={
        {
          left: `${left - width / 2}cqw`,
          top: `${top - height / 2}cqw`,
          width: `${width}cqw`,
          animationDuration: `${period}s`,
          animationDelay: `-${delay}s`,
          "--drift-x": `${x}cqw`,
          "--drift-y": `${y}cqw`,
          "--drift-deg": `${deg}deg`,
        } as React.CSSProperties
      }
    >
      <Image src={art.src} alt="" width={art.width} height={art.height} sizes="30rem" className="h-auto w-full" />
    </span>
  );
}

/** Một nhánh dây leo đặt tĩnh, thường dọc một mép giấy. `left`/`top` là góc trái trên. */
export function Sprig({ name, left, top, width, flip = false }: SprigPlacement) {
  const art = element(name);
  if (!art?.width || !art.height) return null;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute select-none"
      style={{ left: `${left}cqw`, top: `${top}cqw`, width: `${width}cqw`, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <Image src={art.src} alt="" width={art.width} height={art.height} sizes="30rem" className="h-auto w-full" />
    </span>
  );
}
