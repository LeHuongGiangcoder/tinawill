"use client";

import { useEffect, useState } from "react";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { Button } from "@/components/ui/Button";
import { design, intro } from "@/content/client";

/**
 * Màn mở thiệp: chữ và nút nằm trên tờ giấy của <TropicalReveal>.
 *
 * Tờ giấy và cây là một phần của cảnh, nên component này chỉ còn lớp chữ HTML
 * — nó nằm trong cảnh chứ không phủ lên trang. Bấm nút thì `open()` vừa mở
 * thiệp vừa bật nhạc (xem ExperienceProvider); chữ tan trong 650ms theo đúng
 * nhịp của bộ animation, rồi tháo khỏi DOM.
 *
 * `ready` khoá nút cho tới khi ảnh của cảnh đã giải mã xong.
 */

/** Khớp với `transition-opacity` của lớp chữ bên dưới. */
const FADE_MS = 650;

export function Intro({ ready }: { ready: boolean }) {
  const { opened, open } = useExperience();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!opened) return;
    const timer = window.setTimeout(() => setGone(true), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [opened]);

  if (gone) return null;

  return (
    <div
      data-tone={design.intro.tone}
      role="dialog"
      aria-modal="true"
      aria-label={intro.label}
      className={[
        "scene-cover flex flex-col items-center justify-center gap-stack text-center transition-opacity duration-[650ms] ease-glow",
        opened ? "pointer-events-none opacity-0" : ready ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <p className="type-title -mb-tight text-tone-title">{intro.title}</p>
      <p className="type-body mb-tight text-tone-muted text-balance">{intro.note}</p>
      <Button onClick={open} disabled={!ready}>
        {intro.cta}
      </Button>
    </div>
  );
}
