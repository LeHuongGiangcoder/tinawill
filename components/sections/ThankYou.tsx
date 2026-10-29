import { Divider } from "@/components/ui/Divider";
import { Eyebrow, Lead, Script, SectionHead } from "@/components/ui/Heading";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { couple, thankYou } from "@/content/client";

/** Màn cuối: lời cảm ơn, ảnh hai người và hashtag. */
export function ThankYou() {
  return (
    <SectionWrapper section="thankYou" width="prose" labelledBy="thank-you-title">
      <SectionHead
        eyebrow={thankYou.eyebrow}
        title={thankYou.title}
        titleId="thank-you-title"
        subtitle={thankYou.subtitle}
      >
        <div className="mt-tight flex flex-col items-center gap-tight">
          {thankYou.lines.map((line) => (
            <Lead key={line}>{line}</Lead>
          ))}
          <Divider diamond />
        </div>
      </SectionHead>

      {thankYou.image ? (
        <Reveal delay={90} className="mt-block flex justify-center">
          <div className="w-full max-w-[20rem]">
            <ImageFrame
              src={thankYou.image}
              alt={thankYou.imageAlt}
              ratio="4 / 5"
              sizes="(max-width: 48rem) 80vw, 20rem"
            />
          </div>
        </Reveal>
      ) : null}

      <Reveal delay={150} className="mt-block flex flex-col items-center gap-tight text-center">
        <Script>{thankYou.signature}</Script>
        {couple.hashtag ? <Eyebrow>{couple.hashtag}</Eyebrow> : null}
      </Reveal>
    </SectionWrapper>
  );
}
