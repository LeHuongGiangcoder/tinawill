import Image from "next/image";
import type { CSSProperties } from "react";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { hero } from "@/content/client";

/**
 * Thuyền thả đèn hoa đăng trên mặt nước tím chạng vạng.
 *
 * Hero đứng ngay sau Cover. Ảnh là bản đã cắt bỏ viền (1145×1465,
 * public/hero/lantern-boat.webp) và đặt NGUYÊN KHUNG, không `object-cover`:
 * chữ xếp theo toạ độ của ảnh, nên ảnh mà bị cắt theo khổ màn thì chữ lệch
 * khỏi chỗ trống nó được dành cho.
 *
 * Ba cụm chữ đi theo đường đèn trôi — từ thuyền ở góc phải trên, xuống dần
 * về trái — mỗi cụm nằm ở khoảng nước/trời trống:
 *
 *   1. `lead`     trời trống phía trên-trái, trước khi tới thuyền
 *   2. `leadIn · home · and · peace`   bên phải vệt đèn, chỗ nước tối trống
 *   3. `closing`  dưới đáy ảnh, trên phần giấy nối dài cùng màu nước
 *
 * Toạ độ là `cqw` (phần trăm bề rộng khung ảnh) nên chữ giữ đúng chỗ trên mọi
 * khổ màn; cỡ chữ vẫn là hệ chữ chung (`type-*`), không co theo ảnh.
 */

/** Khung gốc của ảnh đã cắt — tỉ lệ này giữ cho toạ độ cqw luôn khớp. */
const ART = { w: 1145, h: 1465 };

/** Chỗ đặt của hai cụm nằm trên ảnh (cqw đo từ góc trái-trên của ảnh). */
const LEAD: CSSProperties = { left: "6cqw", top: "5cqw", width: "50cqw" };
const FLOW: CSSProperties = { left: "52cqw", top: "74cqw", width: "42cqw" };

export function Hero() {
  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[34rem] flex-col">
        <div
          className="@container relative w-full"
          style={{ aspectRatio: `${ART.w} / ${ART.h}` }}
        >
          {/* Chỉ lớp ảnh bị mask (mép dưới tan vào nền, và hai bên khi khung
              hẹp hơn màn): chữ nằm ngoài lớp này nên không bị mờ theo. */}
          <div aria-hidden className="poster-fade pointer-events-none absolute inset-0">
            <Image
              src="/hero/lantern-boat.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 34rem) 100vw, 34rem"
              className="select-none object-cover"
            />
          </div>

          <p
            id="hero-title"
            data-reveal
            className="type-body absolute z-10 text-balance text-tone-fg"
            style={LEAD}
          >
            {hero.lead}
          </p>

          <div
            data-reveal
            data-reveal-delay="180"
            className="absolute z-10 flex flex-col items-start gap-tight text-tone-fg"
            style={FLOW}
          >
            <p className="type-body">{hero.leadIn}</p>
            <p className="type-title text-tone-title">{hero.home}</p>
            <p className="type-body">{hero.and}</p>
            <p className="type-title text-tone-title">{hero.peace}</p>
          </div>
        </div>

        {/* Phần giấy nối dài dưới ảnh: cao ít nhất đủ để cả hero phủ một màn,
            và đặt cụm chữ cuối giữa khoảng còn lại. */}
        <div className="flex flex-1 items-center justify-center px-gutter py-block">
          <p data-reveal data-reveal-delay="120" className="type-body text-balance text-center text-tone-fg">
            {hero.closing}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
