import Image from "next/image";
import type { CSSProperties } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { Caption, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { gifts } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Mấy trái nho tuột khỏi chùm khi khách bấm vào bình.
 *
 * Cả ba trái cùng rụng từ đít chùm — chỗ trái thấp nhất còn dính vào cuống —
 * nên `x`/`y` chỉ lệch nhau một chút cho khỏi chồng khít lên nhau, và cả ba
 * cùng lăn về một phía.
 *
 * Toạ độ là % của chính bức vẽ bình gốm, quãng rơi `drop` và nhịp nảy
 * `bounce` đo bằng bề rộng bức vẽ, nên cả cảnh co giãn cùng nhau:
 * `--unfold-art` trong app/globals.css đổi một con số là chỗ rơi vẫn khớp.
 * Riêng quãng lăn đo bằng `vw` vì nó phải đủ dài để trái nho ra khỏi màn
 * hình, mà màn thì rộng hẹp tuỳ máy. Section cắt tràn ngang
 * (`overflow-x-clip`), nên lăn quá mép là khuất chứ không đẻ ra thanh cuộn.
 */
type FallingPiece = {
  /** Chỗ rời chùm, % của bức vẽ */
  x: number;
  y: number;
  /** Quãng rơi tới mặt đất, tính theo bề rộng bức vẽ */
  drop: number;
  /** Quãng lăn ngang tính theo bề ngang màn hình (vw) */
  roll: number;
  /** Độ cao nhịp nảy đầu tiên — năm nhịp sau cứ thế thấp dần */
  bounce: number;
  /** Cỡ trái, rem */
  size: number;
  /** Vòng xoay lúc lăn */
  spin: number;
  delay: number;
  duration: number;
};

const GRAPES: FallingPiece[] = [
  { x: 78, y: 57, drop: 0.46, roll: 70, bounce: 0.13, size: 1.05, spin: 900, delay: 0, duration: 1700 },
  { x: 80, y: 59, drop: 0.43, roll: 76, bounce: 0.11, size: 0.95, spin: 1080, delay: 120, duration: 1650 },
  { x: 76, y: 60, drop: 0.42, roll: 72, bounce: 0.15, size: 1.15, spin: 840, delay: 230, duration: 1750 },
];

/** Biến CSS của một trái — `.fall-piece` trong app/globals.css đọc chỗ này. */
function pieceVars(piece: FallingPiece): CSSProperties {
  return {
    "--fx": `${piece.x}%`,
    "--fy": `${piece.y}%`,
    "--fdrop": `calc(var(--unfold-art) * ${piece.drop})`,
    "--froll": `${piece.roll}vw`,
    "--fbounce": `calc(var(--unfold-art) * ${piece.bounce})`,
    "--fsize": `${piece.size}rem`,
    "--fspin": `${piece.spin}deg`,
    "--fdelay": `${piece.delay}ms`,
    "--fdur": `${piece.duration}ms`,
  } as CSSProperties;
}

/**
 * Quà cưới & honeymoon fund.
 *
 * Section mở ra chỉ có một bình gốm đứng giữa đang lắc lư — bấm vào nó mới
 * hiện ba lựa chọn, và mỗi lựa chọn cũng chỉ hiện tên, bấm tiếp mới ra lời
 * giải thích. Chuyện tiền nong nên để khách tự chạm vào mới mở, chứ không
 * bày sẵn ra giữa thiệp.
 *
 * Cả hai bậc gập đều là `<details>` của trình duyệt (`.unfold` và
 * `Disclosure`), nên section vẫn là server component và khách mở được cả khi
 * JS chưa tải xong.
 *
 * Thẻ nào chưa có link (ví dụ chưa có thông tin chuyển khoản) thì phần nút tự
 * ẩn — thêm link vào `actions` trong content/client.ts là nút hiện ra.
 */
export function Gifts() {
  const jar = element(gifts.jar);

  return (
    <SectionWrapper section="gifts" width="prose" labelledBy="gifts-title">
      <SectionHead
        eyebrow={gifts.eyebrow}
        title={gifts.title}
        titleId="gifts-title"
        subtitle={gifts.subtitle}
        intro={gifts.intro}
      />

      <Reveal>
        <details className="unfold">
          <summary className="unfold-summary">
            {jar ? (
              <span className="unfold-art">
                {/* Lớp lắc lư nằm trong lớp đổi bề rộng: một lớp một
                    `transform`, nên hai chuyển động không tranh nhau. */}
                <span className="block origin-bottom animate-sway">
                  <Image
                    src={jar.src}
                    alt=""
                    width={jar.width ?? 600}
                    height={jar.height ?? 600}
                    sizes="(max-width: 48rem) 60vw, 13rem"
                    className="h-auto w-full"
                  />
                </span>
              </span>
            ) : null}
            {/* Nho rơi ra khỏi chùm ngay khi khối mở — xem GRAPES ở đầu file. */}
            <span aria-hidden className="fall-layer">
              {GRAPES.map((piece, i) => (
                <span key={i} className="fall-piece" style={pieceVars(piece)}>
                  <span className="fall-drop">
                    <span className="fall-spin">
                      <span className="grape" />
                    </span>
                  </span>
                </span>
              ))}
            </span>

            <Caption className="unfold-closed">{gifts.jarPrompt.closed}</Caption>
            <Caption className="unfold-open">{gifts.jarPrompt.open}</Caption>
          </summary>

          <div className="unfold-body mt-block">
            {gifts.options.map((option) => (
              <Disclosure key={option.title} label={option.title} name="gifts">
                <div className="flex flex-col gap-stack">
                  <p className="text-small text-tone-muted">{option.body}</p>
                  {option.note ? <Caption>{option.note}</Caption> : null}

                  {option.actions.length ? (
                    <div className="flex flex-row flex-wrap items-start gap-stack">
                      {option.actions.map((action) => (
                        <ButtonLink
                          key={action.href}
                          href={action.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          variant="ghost"
                          className="btn-compact"
                        >
                          {action.label}
                        </ButtonLink>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Disclosure>
            ))}
          </div>
        </details>
      </Reveal>
    </SectionWrapper>
  );
}
