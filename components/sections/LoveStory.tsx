import Image from "next/image";

import { Eyebrow, SectionTitle, Subhead } from "@/components/ui/Heading";
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
  const { eyebrow, title, subtitle, paragraphs, closing } = loveStory;

  return (
    /*
      `flush` + `width="bleed"`: trang giấy LÀ cả section, chạm bốn mép đúng
      như trang 8 của bản Canva — không có viền kem nào quanh khung. Nền
      section tô màu lá của chính khung (tông `leaf`), nên phần thừa hai bên
      trên màn rộng hoà làm một với khung.
    */
    <SectionWrapper section="loveStory" flush width="bleed" labelledBy="love-story-title">
      {/*
        `data-tone="light"` cho cả trang: mặt giấy trong khung sáng hơn nền
        section, nên chữ, gạch và chữ phụ bên trong lấy bảng màu của nền sáng
        mà không phải viết màu cứng ở đây.
      */}
      <div data-tone="light" className="page-frame">
        <Image
          src={`${FRAME}/frame-top.webp`}
          alt=""
          aria-hidden
          width={CAP.width}
          height={CAP.top}
          sizes="(max-width: 30rem) 100vw, 30rem"
          unoptimized
          className="page-frame-cap"
        />

        {/* Nhịp sóng của hai mép bên đi qua `style` chứ không nằm trong
            globals.css: file ảnh là tài sản của khách, khuôn thì dùng chung. */}
        <div
          className="page-frame-body flex flex-col gap-block text-tone-fg"
          style={{ borderImageSource: `url(${FRAME}/frame-side.webp)` }}
        >
          {/*
            Đúng ba bậc của SectionHead — eyebrow, tiêu đề viết tay, dòng dẫn
            in nghiêng — nhưng dựng tay chứ không gọi SectionHead: khối ở đây
            nằm trong trang giấy, và `gap-block` của khung giấy đã là đúng
            khoảng cách giữa đầu trang và đoạn đầu tiên.
          */}
          <div className="flex flex-col items-center gap-tight text-center">
            <Eyebrow data-reveal>{eyebrow}</Eyebrow>
            <SectionTitle id="love-story-title" data-reveal data-reveal-delay="90">
              {title}
            </SectionTitle>
            <Subhead data-reveal data-reveal-delay="150" className="max-w-prose">
              {subtitle}
            </Subhead>
          </div>

          <div className="flex flex-col gap-stack">
            {paragraphs.map((text, i) => (
              /* <p> trần: chữ thân bài của site là font body ở bậc `base`,
                 căn trái — giống Travel, Gifts, Dresscode. Bản Canva in hai
                 bên, nhưng cột chữ trong khung chỉ còn ~270px nên chữ in hai
                 bên giãn thành vệt trắng giữa dòng. */
              <p key={text.slice(0, 24)} data-reveal data-reveal-delay={(i + 1) * 60}>
                {text}
              </p>
            ))}

            {closing ? (
              <p
                data-reveal
                data-reveal-delay={(paragraphs.length + 1) * 60}
                className="text-small italic text-tone-muted"
              >
                {closing}
              </p>
            ) : null}
          </div>
        </div>

        <Image
          src={`${FRAME}/frame-bottom.webp`}
          alt=""
          aria-hidden
          width={CAP.width}
          height={CAP.bottom}
          sizes="(max-width: 30rem) 100vw, 30rem"
          unoptimized
          className="page-frame-cap"
        />
      </div>
    </SectionWrapper>
  );
}
