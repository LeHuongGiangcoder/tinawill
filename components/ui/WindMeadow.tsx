import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * Một tấm nền có gió thổi liên tục: cả tấm ngả nhẹ, và từng luồng gió quét
 * chéo qua làm cỏ rạp xuống, sáng lên. Toàn bộ là CSS (`.wind-field`,
 * `.wind-gust` trong app/globals.css), không có JS — nên đây vẫn là server
 * component và gió chạy cả khi GSAP chưa tải.
 *
 * Ba luồng lệch nhịp nhau (thời lượng và độ trễ khác nhau) để không bao giờ
 * thấy một nhịp lặp đều tăm tắp.
 */
const GUSTS = [
  { duration: "7.5s", delay: "0s" },
  { duration: "10s", delay: "-4.2s" },
  { duration: "12.5s", delay: "-8.6s" },
];

export function WindMeadow({ src, priority = false }: { src: string; priority?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-clip">
      <div className="wind-field">
        <Image src={src} alt="" fill sizes="112vw" priority={priority} className="object-cover" />
        {GUSTS.map((g) => (
          <div
            key={g.delay}
            className="wind-gust"
            style={{ "--gust-duration": g.duration, "--gust-delay": g.delay } as CSSProperties}
          >
            <div>
              <Image src={src} alt="" fill sizes="112vw" className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
