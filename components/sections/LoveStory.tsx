import Image from "next/image";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { loveStory } from "@/content/client";

/**
 * "Our story" — một trang giấy duy nhất trong khung vẽ tay của khách.
 *
 * Khung gốc là một file 9/16, nhưng chuyện tình dài hơn một khung 9/16 trên
 * điện thoại, nên nó được cắt làm ba: hai nắp (ảnh nguyên vẹn, giữ nguyên hoa
 * bốn góc và hai bụi cỏ dưới chân trang) và một nhịp sóng của mép bên để lặp
 * lại giữa hai nắp. Khuôn `.page-frame` trong app/globals.css lo phần ghép;
 * section này chỉ nói ba file ảnh là file nào và đổ chữ vào.
 *
 * Đổi lời là sửa `loveStory` trong content/client.ts — thêm một đoạn thì
 * trang tự cao lên, khung co theo, không phải tính lại toạ độ gì.
 */

const FRAME = "/love-story";

/** Bề rộng ảnh khung gốc — dùng cho `sizes` của next/image. */
const CAP = { width: 860, top: 299, bottom: 326 };

export function LoveStory() {
  const { title, paragraphs, closing } = loveStory;

  return (
    <SectionWrapper section="loveStory" width="prose" labelledBy="love-story-title">
      {/*
        `data-tone="light"` cho cả trang: mặt giấy trong khung sáng hơn nền
        section, nên chữ, gạch và chữ phụ bên trong lấy bảng màu của nền sáng
        mà không phải viết màu cứng ở đây.
      */}
      <div data-tone="light" className="page-frame shadow-paper">
        <Image
          src={`${FRAME}/frame-top.webp`}
          alt=""
          aria-hidden
          width={CAP.width}
          height={CAP.top}
          sizes="(max-width: 48rem) 100vw, 40rem"
          unoptimized
          className="page-frame-cap"
        />

        {/* Nhịp sóng của hai mép bên đi qua `style` chứ không nằm trong
            globals.css: file ảnh là tài sản của khách, khuôn thì dùng chung. */}
        <div
          className="page-frame-body flex flex-col gap-stack text-tone-fg"
          style={{ borderImageSource: `url(${FRAME}/frame-side.webp)` }}
        >
          {/*
            <h2> trần chứ không dùng <Heading>: Heading luôn kèm sẵn
            `font-display`, mà tiêu đề này là chữ viết tay — hai class cùng
            thuộc tính chồng nhau thì thắng thua phụ thuộc thứ tự sinh CSS.
          */}
          <h2
            id="love-story-title"
            data-reveal
            className="text-center font-script text-h2 text-tone-fg"
          >
            {title}
          </h2>

          {paragraphs.map((text, i) => (
            <p
              key={text.slice(0, 24)}
              data-reveal
              data-reveal-delay={(i + 1) * 60}
              /* Chữ in hai bên như bản vẽ của khách; `hyphens-auto` để cột
                 chữ hẹp trên điện thoại không hở những khoảng trắng dài.

                 Bậc chữ nhỏ trên điện thoại: khung ăn mất gần một phần ba bề
                 rộng, nên cột chữ chỉ còn ~250px — ở `text-base` mỗi dòng chỉ
                 vừa 28 chữ cái và chữ in hai bên bắt đầu giãn thành vệt. */
              className="font-display text-small hyphens-auto text-justify sm:text-base"
            >
              {text}
            </p>
          ))}

          {closing ? (
            <p
              data-reveal
              data-reveal-delay={(paragraphs.length + 1) * 60}
              className="font-display text-small italic text-tone-muted sm:text-base"
            >
              {closing}
            </p>
          ) : null}
        </div>

        <Image
          src={`${FRAME}/frame-bottom.webp`}
          alt=""
          aria-hidden
          width={CAP.width}
          height={CAP.bottom}
          sizes="(max-width: 48rem) 100vw, 40rem"
          unoptimized
          className="page-frame-cap"
        />
      </div>
    </SectionWrapper>
  );
}
