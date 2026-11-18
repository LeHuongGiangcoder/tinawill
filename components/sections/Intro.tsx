"use client";

import { useEffect, useState, useSyncExternalStore, type MouseEvent } from "react";

import { useRouter } from "next/navigation";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useLang } from "@/components/experience/LangProvider";
import { design, languages, type Lang } from "@/content/client";

/**
 * Màn mở thiệp: chữ và nút nằm trên tờ giấy của <TropicalReveal>.
 *
 * Tờ giấy và cây là một phần của cảnh, nên component này chỉ còn lớp chữ HTML
 * — nó nằm trong cảnh chứ không phủ lên trang. Bấm nút thì `open()` vừa mở
 * thiệp vừa bật nhạc (xem ExperienceProvider); chữ tan trong 650ms theo đúng
 * nhịp của bộ animation, rồi tháo khỏi DOM.
 *
 * Lần đầu vào, tờ giấy chỉ có các nút chọn tiếng. Chọn tiếng nào thì các nút đó
 * biến mất, lời chào của tiếng đó hiện ra, và trang chuyển sang bản dịch tương
 * ứng ("/", "/vi") để phần thiệp phía sau cũng đúng tiếng. Thiệp chưa mở và
 * nhạc chưa bật nên chuyển trang lúc này không mất gì; giữ nguyên `?to=` để
 * link mời riêng vẫn gọi đúng tên khách.
 *
 * Đã chọn thì nhớ trong phiên (sessionStorage), để trang bản dịch dựng lại
 * cảnh vẫn hiện thẳng lời chào chứ không hỏi lại. Nút chọn tiếng là link thật,
 * nên khi JS tắt khách vẫn sang được bản dịch.
 *
 * `ready` khoá nút cho tới khi ảnh của cảnh đã giải mã xong.
 */

/** Khớp với `transition-opacity` của lớp chữ bên dưới. */
const FADE_MS = 650;

const PICKED_KEY = "glow-lang-picked";

function readPicked(): boolean {
  try {
    return window.sessionStorage.getItem(PICKED_KEY) === "1";
  } catch {
    return false;
  }
}

function writePicked() {
  try {
    window.sessionStorage.setItem(PICKED_KEY, "1");
  } catch {
    /* Chế độ ẩn danh chặn storage: lần vào sau hỏi lại tiếng, vô hại. */
  }
}

const subscribeNever = () => () => {};

export function Intro({ ready }: { ready: boolean }) {
  const router = useRouter();
  const { opened, open } = useExperience();
  const { lang, intros } = useLang();
  /* Server chưa biết khách đã chọn chưa, nên HTML tĩnh luôn là màn chọn tiếng. */
  const pickedBefore = useSyncExternalStore(subscribeNever, readPicked, () => false);
  const [chosen, setChosen] = useState<Lang | null>(null);
  const [gone, setGone] = useState(false);
  const current = chosen ?? (pickedBefore ? lang : null);
  const intro = intros[current ?? lang];

  useEffect(() => {
    for (const item of languages.list) router.prefetch(item.path);
  }, [router]);

  useEffect(() => {
    if (!opened) return;
    const timer = window.setTimeout(() => setGone(true), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [opened]);

  if (gone) return null;

  function choose(event: MouseEvent<HTMLAnchorElement>, id: Lang, path: string) {
    event.preventDefault();
    writePicked();
    setChosen(id);
    if (id !== lang) router.replace(`${path}${window.location.search}`, { scroll: false });
  }

  return (
    <div
      data-tone={design.intro.tone}
      role="dialog"
      aria-modal="true"
      aria-label={current ? intro.label : languages.label}
      lang={current ?? undefined}
      className={[
        "scene-cover flex flex-col items-center justify-center gap-tight text-center transition-opacity duration-[650ms] ease-glow",
        opened ? "pointer-events-none opacity-0" : ready ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {current ? (
        <>
          <p className="type-title text-tone-title">{intro.title}</p>
          <p className="type-body mb-tight text-tone-muted text-balance">{intro.note}</p>
          <Button onClick={open} disabled={!ready}>
            {intro.cta}
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-stretch gap-stack">
          {languages.list.map((item) => (
            <ButtonLink
              key={item.id}
              href={item.path}
              lang={item.id}
              hrefLang={item.id}
              onClick={(event) => choose(event, item.id, item.path)}
            >
              {item.label}
            </ButtonLink>
          ))}
        </div>
      )}
    </div>
  );
}
