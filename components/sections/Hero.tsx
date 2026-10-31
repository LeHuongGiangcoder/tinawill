import Image from "next/image";
import type { CSSProperties } from "react";

import { Heading } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TropicalReveal } from "@/components/ui/TropicalReveal";
import { couple, hero } from "@/content/client";

/**
 * Trang bìa: tán lá mở ra, lời mời nổi trên mặt nước.
 *
 * Nền là <TropicalReveal> — cùng một cảnh với màn mở thiệp, chỉ khác trạng
 * thái. Tán lá mở ra để lộ nền giấy xanh rồi chữ mới hiện, nằm giữa trang, nên các khối gắn
 * `data-hero`: chúng chờ cú chạm mở thiệp chứ không chờ cuộn (hero đứng ngay
 * đầu trang nên sẽ không bao giờ "cuộn tới"). Nhịp chờ là `motion.heroDelay`.
 */
export function Hero() {
  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center">
        <TropicalReveal />

        <div className="container-site relative z-20 flex flex-col items-center gap-stack text-center">
          <div
            data-reveal
            data-hero
            aria-hidden
            className="glyph h-20 w-20 text-beige"
            style={{ "--glyph": "url(/logo/monogram.webp)" } as CSSProperties}
          />
          <p data-reveal data-hero className="whitespace-pre-line font-script text-h3 text-beige">
            {hero.invitation}
          </p>

          <Heading
            level="display"
            id="hero-title"
            data-reveal
            data-hero
            className="flex items-baseline justify-center gap-tight text-beige short:text-h1"
          >
            <span>{couple.groom}</span>
            <span className="font-script text-h2 text-tone-accent">&amp;</span>
            <span>{couple.bride}</span>
          </Heading>

          {/* Hai chân dung quay vào nhau, mỗi người nghiêng một phía; trái tim
              đập nhịp ở giữa. Hai đầu rung nhẹ lệch pha nhau. */}
          <div data-reveal data-hero aria-hidden className="mt-block flex w-full items-center justify-center gap-tight">
            <div className="w-[36%] rotate-[7deg]">
              <Image src="/hero/tina.webp" unoptimized alt="" width={600} height={732} className="animate-tremble h-auto w-full" />
            </div>
            <svg viewBox="0 0 24 22" className="animate-heartbeat w-[12%] shrink-0 text-heart" fill="currentColor">
              <path d="M12 21.2 10.6 20C5.4 15.3 2 12.2 2 8.4 2 5.3 4.4 3 7.4 3c1.7 0 3.4.8 4.6 2.1C13.2 3.8 14.9 3 16.6 3 19.6 3 22 5.3 22 8.4c0 3.8-3.4 6.9-8.6 11.6L12 21.2Z" />
            </svg>
            <div className="w-[36%] -rotate-[7deg]">
              <Image src="/hero/will.webp" unoptimized alt="" width={600} height={589} className="animate-tremble-late h-auto w-full" />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-section">
          <p data-reveal data-hero className="text-eyebrow uppercase text-tone-muted">
            {hero.scrollHint} ↓
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
