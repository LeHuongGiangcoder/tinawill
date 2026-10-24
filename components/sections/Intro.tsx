"use client";

import Image from "next/image";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow, Heading } from "@/components/ui/Heading";
import { couple, design, intro } from "@/content/client";
import { background as resolveBackground } from "@/lib/assets";

/**
 * Màn mở thiệp. Nằm phủ kín màn hình, giữ trang khoá cuộn cho tới khi khách
 * bấm "Mở thiệp" — chính cú chạm đó bật nhạc (xem ExperienceProvider).
 *
 * Mở xong thì component tự bỏ khỏi cây DOM, nên không có gì chặn cuộn nữa.
 */
export function Intro() {
  const { opened, open } = useExperience();

  if (opened) return null;

  /* Màn mở thiệp không dùng SectionWrapper (nó phủ kín màn hình, nằm ngoài
     luồng cuộn), nên nó tự đọc phần mặt nhìn của mình từ `design`. */
  const spec = design.intro;
  const background = resolveBackground(spec.background);

  return (
    <div
      data-tone={spec.tone}
      role="dialog"
      aria-modal="true"
      aria-label={intro.eyebrow}
      className="fixed inset-0 z-40 flex items-center justify-center bg-tone-bg text-tone-fg"
    >
      {background ? (
        <>
          <Image src={background.src} alt="" fill sizes="100vw" priority className="object-cover" />
          <div
            aria-hidden
            className="absolute inset-0 bg-tone-bg"
            style={{ opacity: spec.overlay ?? 0.55 }}
          />
        </>
      ) : null}

      <div className="container-prose relative flex flex-col items-center gap-stack text-center">
        <Eyebrow>{intro.eyebrow}</Eyebrow>

        <Heading level="h1" className="flex flex-col items-center short:text-h2">
          <span>{couple.groom}</span>
          <span className="font-script text-h2 text-tone-accent">&amp;</span>
          <span>{couple.bride}</span>
        </Heading>

        <Divider diamond />

        <p className="font-script text-h3">{intro.note}</p>

        <Button onClick={open} className="mt-stack">
          {intro.cta}
        </Button>
      </div>
    </div>
  );
}
