"use client";

import { useEffect, useRef, useState } from "react";

import { Caption, SectionHead } from "@/components/ui/Heading";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { gallery } from "@/content/client";

/** Cuộn quá bấy nhiêu px thì coi như khách đã hiểu là kéo ngang được. */
const SEEN = 24;
/** Cú đẩy mồi: nhích dải ảnh một nhịp rồi trả về chỗ cũ. */
const NUDGE = 56;

/**
 * Album ảnh, xếp thành một dải kéo ngang.
 *
 * Lần đầu dải ảnh lọt vào khung nhìn, nó tự nhích một nhịp rồi trả về — nói
 * "kéo ngang được" bằng chuyển động nhanh hơn mọi dòng chữ. Ai tắt hiệu ứng
 * thì bỏ qua cú đẩy này, chỉ còn dòng gợi ý.
 */
export function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (track.scrollLeft > SEEN) return;
        track.scrollTo({ left: NUDGE, behavior: "smooth" });
        window.setTimeout(() => track.scrollTo({ left: 0, behavior: "smooth" }), 620);
      },
      { threshold: 0.35 },
    );

    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper section="gallery" width="bleed" labelledBy="gallery-title">
      <div className="container-site py-section pb-0">
        <SectionHead
          eyebrow={gallery.eyebrow}
          title={gallery.title}
          titleId="gallery-title"
          intro={gallery.note}
        />
      </div>

      <Reveal>
        <div
          ref={trackRef}
          className="reel px-gutter"
          tabIndex={0}
          role="group"
          aria-label={gallery.title}
          onScroll={(event) => setMoved(event.currentTarget.scrollLeft > SEEN)}
        >
          {gallery.shots.map((shot, i) => (
            <ImageFrame
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              ratio="2 / 3"
              tilt={i % 2 === 0 ? -1.5 : 1.5}
              sizes="(max-width: 48rem) 62vw, 18rem"
              className="w-[62%] sm:w-[18rem]"
            />
          ))}
        </div>
      </Reveal>

      <div className="container-site pb-section pt-stack text-center">
        <Caption
          className="flex items-center justify-center gap-tight transition-opacity duration-500"
          style={{ opacity: moved ? 0 : 1 }}
        >
          {gallery.hint}
          <span aria-hidden className="animate-nudge">
            →
          </span>
        </Caption>
      </div>
    </SectionWrapper>
  );
}
