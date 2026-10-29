import Image from "next/image";

import { Disclosure } from "@/components/ui/Disclosure";
import { Caption, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { dresscode } from "@/content/client";

/**
 * Trang phục: câu dẫn, bảng màu, rồi gợi ý cho từng nhóm khách.
 *
 * Ô màu đọc hex thẳng từ client.ts — đây là chỗ duy nhất trong site được phép
 * nhận mã màu từ nội dung, vì bảng màu là nội dung của khách chứ không phải
 * theme của site. Mỗi ô là một vệt sơn có nét cọ: CHỈ một file ảnh cho cả sáu
 * ô, màu do CSS tô lên (xem `.swatch` trong app/globals.css), nên đổi một mã
 * màu là ô đổi theo chứ không phải xuất lại ảnh. Dưới mỗi ô in luôn mã hex để
 * khách cầm đi may áo dài hay đưa cho thợ. Bảng màu xếp ba cột trên điện
 * thoại, sáu cột từ sm trở lên.
 *
 * Sáu khối gợi ý là khối gập (components/ui/Disclosure.tsx): mở hết ra thì
 * section dài hơn hai màn điện thoại và khách phải cuộn qua một bức tường
 * chữ mới tới phần tiếp theo. Khối đầu mở sẵn để thấy ngay đây là thứ bấm
 * vào được.
 *
 * Dải dù sọc ở chân section là tranh khách gửi, cắt từ bản Canva
 * (`node scripts/dresscode-assets.mjs`). Nền cam của bản gốc chính là giấy
 * `paper-mango` của site nên không phải cắt theo; tiêu đề cũng là chữ thật.
 */
export function Dresscode() {
  return (
    <SectionWrapper section="dresscode" width="bleed" flush labelledBy="dresscode-title">
      {/* `flush` + tự đặt lề trên: dải dù phải chạm đúng mép dưới section như
          bản Canva, nên section không được có khoảng đệm dưới. */}
      <div className="container-prose pt-section">
        <SectionHead
          eyebrow={dresscode.eyebrow}
          title={dresscode.title}
          titleId="dresscode-title"
          /* Dòng này là TÊN bảng màu, không phải một câu dẫn — bậc `motif`,
             xem Subhead trong components/ui/Heading.tsx. */
          subtitle={dresscode.subtitle}
          subtitleVariant="motif"
          intro={dresscode.note}
        />

        {dresscode.swatches.length > 0 ? (
          <Reveal delay={90} className="mt-block flex flex-col items-center gap-stack">
            <ul className="grid w-full max-w-[22rem] grid-cols-3 gap-stack sm:max-w-none sm:grid-cols-6">
              {dresscode.swatches.map((swatch) => (
                <li key={swatch.hex} className="flex flex-col items-center gap-tight text-center">
                  {/* Vệt sơn khách gửi, tô bằng mã màu của chính ô — hình
                      dáng và nét cọ nằm ở `.swatch` trong app/globals.css. */}
                  <span
                    aria-hidden
                    className="swatch w-full"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-small">{swatch.name}</span>
                  {/* Mã màu viết hoa cho dễ đọc; `tabular-nums` để sáu mã
                      xếp thành cột thẳng hàng thay vì so le. */}
                  <span className="font-body text-small tabular-nums uppercase text-tone-muted">
                    {swatch.hex}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {dresscode.notes.length > 0 ? (
          <div className="mt-block flex flex-col">
            {dresscode.notes.map((note, i) => (
              <Reveal key={note.label} delay={i * 60}>
                <Disclosure label={note.label} defaultOpen={i === 0}>
                  <p className="text-small text-tone-muted">{note.body}</p>
                </Disclosure>
              </Reveal>
            ))}
          </div>
        ) : null}

        {dresscode.avoid ? (
          <Reveal delay={120} className="mt-block flex justify-center">
            <Caption className="text-center">{dresscode.avoid}</Caption>
          </Reveal>
        ) : null}
      </div>

      {/*
        Dải dù sọc, tràn hết bề ngang và chạm mép dưới section.

        Tỉ lệ đổi theo bề rộng màn: trên điện thoại giữ nguyên tỉ lệ thật của
        file (1600×782) nên không dù nào bị cắt; từ md trở lên khung dẹt dần
        và `object-top` giữ hàng dù lại, phần bị cắt chỉ là bãi cát phía dưới
        — nếu không, trên màn 1440px dải này cao tới 700px toàn cát.
      */}
      <div
        aria-hidden
        className="relative mt-section aspect-[1600/782] w-full md:aspect-[4/1] lg:aspect-[5/1]"
      >
        <Image
          src="/dresscode/umbrellas.webp"
          alt=""
          fill
          sizes="100vw"
          /* Dải đã đúng cỡ hiển thị — xem components/sections/Venue.tsx */
          unoptimized
          className="pointer-events-none select-none object-cover object-top"
        />
      </div>
    </SectionWrapper>
  );
}
