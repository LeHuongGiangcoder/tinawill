import Image from "next/image";
import type { CSSProperties } from "react";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { WindMeadow } from "@/components/ui/WindMeadow";
import { couple, hero } from "@/content/client";

/**
 * Đồng cỏ nhìn từ trên cao — cỏ lay theo gió (WindMeadow), cô dâu chú rể nằm
 * giữa cỏ, cô dâu vẫy tay không ngừng.
 *
 * Hero đứng ngay sau Cover; màn mở thiệp và cảnh tán lá giờ nằm ở Cover, nên
 * chữ ở đây chỉ `data-reveal` — hiện khi cuộn tới như mọi section khác.
 */
export function Hero() {
  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center">
        <WindMeadow src="/hero/meadow-ver2.webp" />

        <div className="container-site relative z-20 flex flex-col items-center gap-stack py-section text-center">
          {/* Đôi chim ngậm ruy băng — mở đầu trang, ngay trên lời mời. */}
          <div data-reveal aria-hidden className="w-full max-w-[min(18rem,64vw)]">
            <Image
              src="/hero/birds-ribbon.webp"
              alt=""
              width={1997}
              height={787}
              sizes="(max-width: 40rem) 64vw, 18rem"
              priority
              className="h-auto w-full"
            />
          </div>
          <div>
            <p data-reveal className="type-body whitespace-pre-line text-tone-fg">
              {hero.invitation}
            </p>
          </div>

          {/* Tên hai người là title của trang — cùng bộ chữ với "Hi:)". */}
          <h1
            id="hero-title"
            data-reveal
            className="type-title flex items-baseline justify-center gap-tight text-tone-title"
          >
            <span>{couple.groom}</span>
            <span className="text-tone-accent">&amp;</span>
            <span>{couple.bride}</span>
          </h1>

          {/* Cặp đôi nằm trên cỏ, nhìn từ trên cao. Tranh là bản "sạch" đã
              xoá tay vẫy của cô dâu; cánh tay là một lớp riêng chồng lên đúng
              chỗ cũ và quay quanh vai. Toạ độ là % của khung tranh, đo từ
              public/hero couple updated.png — giữ nguyên tỉ lệ khung là tay luôn khớp. */}
          <div data-reveal aria-hidden className="relative mt-block w-full max-w-[min(34rem,36svh)]">
            <Image
              src="/hero/couple-plate-poppies.webp"
              alt=""
              width={1272}
              height={1070}
              sizes="(max-width: 40rem) 92vw, 34rem"
              className="h-auto w-full"
            />
            <Image
              src="/hero/bride-arm-poppies.webp"
              alt=""
              width={147}
              height={286}
              sizes="(max-width: 40rem) 11vw, 4rem"
              className="wave-limb absolute left-[27.83%] top-[17.85%] w-[11.56%]"
              style={{ "--pivot": "82% 94%" } as CSSProperties}
            />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-section">
          <p data-reveal className="text-eyebrow uppercase text-tone-muted">
            {hero.scrollHint} ↓
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
