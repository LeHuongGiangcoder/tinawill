"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Divider } from "@/components/ui/Divider";
import { Caption, Eyebrow, Heading, Lead, SectionHead } from "@/components/ui/Heading";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { loveStory } from "@/content/client";

/**
 * Chuyện tình, kể bằng một băng thẻ kéo ngang.
 *
 * Dùng scroll-snap gốc của trình duyệt: trên điện thoại vuốt là xong, trên
 * máy tính có hai mũi tên và hàng chấm. Không cần thư viện carousel nào, và
 * cũng không có listener nào chạy khi khách không chạm tới.
 */
export function LoveStory() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [hintDone, setHintDone] = useState(false);

  const { chapters, finale } = loveStory;

  /*
    Vị trí thẻ đang xem được suy ra từ scrollLeft, không giữ state riêng — nhờ
    vậy vuốt tay và bấm mũi tên không bao giờ nói hai điều khác nhau.
  */
  const syncIndex = useCallback(() => {
    const track = trackRef.current;
    const slide = track?.firstElementChild as HTMLElement | null;
    if (!track || !slide) return;
    const step = slide.offsetWidth + parseFloat(getComputedStyle(track).gap || "0");
    setIndex(Math.round(track.scrollLeft / step));
    if (track.scrollLeft > 8) setHintDone(true);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", syncIndex, { passive: true });
    return () => track.removeEventListener("scroll", syncIndex);
  }, [syncIndex]);

  // Chữ "vuốt sang" chỉ nhắc một lần rồi tự tắt, không ngồi nhấp nháy mãi.
  useEffect(() => {
    if (hintDone) return;
    const timer = setTimeout(() => setHintDone(true), 6000);
    return () => clearTimeout(timer);
  }, [hintDone]);

  const goTo = useCallback((next: number) => {
    setHintDone(true);
    const track = trackRef.current;
    const slide = track?.children[next] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  return (
    <SectionWrapper section="loveStory" labelledBy="love-story-title">
      <SectionHead
        eyebrow={loveStory.eyebrow}
        title={loveStory.title}
        titleId="love-story-title"
        intro={loveStory.intro}
      />

      <Reveal className="relative">
        {!hintDone ? (
          <p
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/3 z-10 flex items-center gap-tight rounded-btn border border-tone-line bg-tone-bg/90 px-stack py-tight text-eyebrow uppercase text-tone-fg shadow-paper"
          >
            {/* Nhắc nhẹ, công cụ thật là mũi tên và hàng chấm bên dưới */}
            Vuốt
            <span className="animate-nudge">→</span>
          </p>
        ) : null}

        <ul className="reel" ref={trackRef} onPointerDown={() => setHintDone(true)}>
          {chapters.map((chapter, i) => (
            <li key={chapter.title} className="w-[78%] sm:w-[22rem]">
              <article
                className="flex flex-col gap-stack"
                style={{ transform: `rotate(${i % 2 === 0 ? -1.2 : 1.2}deg)` }}
                aria-label={`${chapter.year} — ${chapter.title}`}
              >
                <ImageFrame
                  src={chapter.photo}
                  alt={chapter.alt}
                  ratio="3 / 4"
                  sizes="(max-width: 48rem) 78vw, 22rem"
                />
                <div className="flex flex-col gap-tight text-center">
                  <Eyebrow>{chapter.year}</Eyebrow>
                  <Heading level="h4">{chapter.title}</Heading>
                  <Caption>{chapter.body}</Caption>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-stack flex items-center justify-center gap-stack">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index <= 0}
          aria-label="Chương trước"
          className="flex size-tap items-center justify-center rounded-btn border border-tone-line text-tone-fg disabled:opacity-35"
        >
          <span aria-hidden>←</span>
        </button>

        <div className="flex items-center gap-tight">
          {chapters.map((chapter, i) => (
            <button
              key={chapter.title}
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === index}
              aria-label={`Xem ${chapter.year}`}
              className="size-2 rounded-btn bg-tone-fg transition-opacity duration-200 aria-[current=true]:opacity-100 opacity-30"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index >= chapters.length - 1}
          aria-label="Chương sau"
          className="flex size-tap items-center justify-center rounded-btn border border-tone-line text-tone-fg disabled:opacity-35"
        >
          <span aria-hidden>→</span>
        </button>
      </div>

      {finale ? (
        <Reveal delay={90} className="mt-block flex flex-col items-center gap-tight text-center">
          <Divider diamond />
          <Eyebrow>{finale.year}</Eyebrow>
          <Heading level="h3">{finale.title}</Heading>
          <Lead>{finale.body}</Lead>
        </Reveal>
      ) : null}
    </SectionWrapper>
  );
}
