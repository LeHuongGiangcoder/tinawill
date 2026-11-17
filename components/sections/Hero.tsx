import Image from "next/image";
import type { CSSProperties } from "react";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { hero } from "@/content/client";

/**
 * Thuyền thả đèn hoa đăng trên mặt nước đỏ rượu.
 *
 * Hero đứng ngay sau Cover. Ảnh (1109×1419, public/hero/home.webp) đặt NGUYÊN
 * KHUNG, không `object-cover`: chữ xếp theo toạ độ của ảnh, nên ảnh mà bị cắt
 * theo khổ màn thì chữ lệch khỏi chỗ trống nó được dành cho.
 *
 * Hai đoạn chữ canh giữa, mỗi đoạn nằm ở một khoảng nước trống:
 *
 *   1. `lead`     bên trái mui thuyền, ngang với mép trên mui
 *   2. `closing`  bên phải vệt đèn trôi, nửa dưới ảnh
 *
 * Toạ độ là `cqw` (phần trăm bề rộng khung ảnh), và cỡ chữ cũng co theo ảnh
 * (`type-art-body`, `--art-w` = bề ngang khung) — mỗi dòng giữ ~26 ký tự như
 * bản thiết kế, nên khối chữ không bao giờ phình ra đè lên thuyền.
 */

/** Khung gốc của ảnh — tỉ lệ này giữ cho toạ độ cqw luôn khớp. */
const ART = { w: 1109, h: 1419 };

/** Chỗ đặt của hai đoạn (cqw đo từ góc trái-trên của ảnh). */
const LEAD: CSSProperties = { left: "8cqw", top: "16cqw", width: "40cqw" };
const CLOSING: CSSProperties = { left: "52cqw", top: "78cqw", width: "40cqw" };

export function Hero() {
  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <div className="mx-auto w-full max-w-[34rem]">
        <div
          className="@container relative w-full [--art-w:100cqw]"
          style={{ aspectRatio: `${ART.w} / ${ART.h}` }}
        >
          {/* Chỉ lớp ảnh bị mask (mép dưới tan vào nền, và hai bên khi khung
              hẹp hơn màn): chữ nằm ngoài lớp này nên không bị mờ theo. */}
          <div aria-hidden className="poster-fade pointer-events-none absolute inset-0">
            <Image
              src="/hero/home.webp"
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
            className="type-art-body absolute z-10 text-balance text-center text-tone-fg"
            style={LEAD}
          >
            {hero.lead}
          </p>

          <p
            data-reveal
            data-reveal-delay="180"
            className="type-art-body absolute z-10 text-balance text-center text-tone-fg"
            style={CLOSING}
          >
            {hero.closing}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
