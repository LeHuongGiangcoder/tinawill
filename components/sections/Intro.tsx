"use client";

import { useEffect, useState } from "react";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { design, intro } from "@/content/client";

/**
 * Màn mở thiệp: một tấm giấy giữa khu vườn.
 *
 * Nền của màn này KHÔNG nằm ở đây — nó là <GardenStage> của hero, lúc này
 * đang ở trạng thái lá che kín giữa khung. Nhờ vậy khi khách bấm "Open
 * invitation", lá rút ra hai bên trong cùng một cảnh thay vì đổi sang một ảnh
 * khác; tấm giấy chỉ việc mờ đi để lộ mặt nước.
 *
 * Trang vẫn khoá cuộn cho tới khi thiệp mở (xem ExperienceProvider). Bấm xong
 * thì tấm giấy mờ dần rồi component tự bỏ khỏi cây DOM.
 */
export function Intro() {
  const { opened, open } = useExperience();
  const [gone, setGone] = useState(false);

  // Chờ tấm giấy mờ hết rồi mới tháo khỏi DOM, không giật một nhịp.
  useEffect(() => {
    if (!opened) return;
    const timer = window.setTimeout(() => setGone(true), 900);
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
        "fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-700 ease-glow",
        opened ? "pointer-events-none opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <div className="container-prose flex justify-center">
        <div className="card flex w-full max-w-[22rem] flex-col items-center gap-stack text-center">
          <p className="font-script text-h3">{intro.note}</p>

          <Divider diamond />

          <Button onClick={open}>{intro.cta}</Button>
        </div>
      </div>
    </div>
  );
}
