import Image from "next/image";

import { Divider } from "@/components/ui/Divider";
import { Eyebrow, Lead, Script, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { couple, thankYou } from "@/content/client";

/** Màn cuối: lời cảm ơn, ảnh hai người và hashtag. */
export function ThankYou() {
  return (
    <SectionWrapper section="thankYou" width="card" labelledBy="thank-you-title">
      <SectionHead
        eyebrow={thankYou.eyebrow}
        title={thankYou.title}
        titleId="thank-you-title"
        subtitle={thankYou.subtitle}
      >
        <div className="mt-tight flex flex-col items-center gap-stack">
          {thankYou.paragraphs.map((text) => (
            <Lead key={text} className="text-justify">
              {text}
            </Lead>
          ))}
          <Divider diamond />
        </div>
      </SectionHead>

      {/* Hai khung hình mèo chạy như GIF — xem `.flip-pair` trong globals.css.
          Cả hai là lớp full khung 3375×6000; mèo chỉ chiếm giữa khung nên cắt
          dải trên/dưới trống, mèo vẫn đúng tỉ lệ tranh gốc. */}
      <Reveal delay={90} className="mt-tight flex justify-center">
        <div className="flip-pair aspect-[1200/985] w-full max-w-[30rem]">
          <Image
            src="/thank-you/calm.webp"
            alt={thankYou.imageAlt}
            width={1200}
            height={2133}
            sizes="(max-width: 30rem) 100vw, 30rem"
            className="flip-frame flip-a object-[50%_42.4%]"
          />
          <Image
            src="/thank-you/startled.webp"
            alt=""
            aria-hidden
            width={1200}
            height={2133}
            sizes="(max-width: 30rem) 100vw, 30rem"
            className="flip-frame flip-b object-[50%_42.4%]"
          />
        </div>
      </Reveal>

      <Reveal delay={150} className="mt-stack flex flex-col items-center gap-tight text-center">
        <Script>{thankYou.signature}</Script>
        {couple.hashtag ? <Eyebrow>{couple.hashtag}</Eyebrow> : null}
      </Reveal>

      {/* Monogram khép thiệp. Tô bằng màu chữ của section (xem `.logo-mark`). */}
      <Reveal delay={210} className="mt-block flex justify-center">
        <span role="img" aria-label={thankYou.logoLabel} className="logo-mark w-20" />
      </Reveal>
    </SectionWrapper>
  );
}
