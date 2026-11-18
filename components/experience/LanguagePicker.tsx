"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { useLang } from "@/components/experience/LangProvider";
import { Button } from "@/components/ui/Button";
import { languages } from "@/content/client";
import { background as resolveBackground } from "@/lib/assets";

/** Đã chọn trong phiên này thì không hỏi lại — kể cả sau khi chuyển sang /vi, /de. */
const PICKED_KEY = "glow-lang-picked";

function readPicked(): boolean {
  try {
    return window.sessionStorage.getItem(PICKED_KEY) === "1";
  } catch {
    return false;
  }
}

const subscribeNever = () => () => {};

function writePicked() {
  try {
    window.sessionStorage.setItem(PICKED_KEY, "1");
  } catch {
    /* Chế độ ẩn danh chặn storage: popup sẽ hỏi lại ở lần vào sau, vô hại. */
  }
}

/**
 * Popup chọn tiếng, hiện đè lên màn mở thiệp ở lần đầu khách vào.
 *
 * Mỗi thứ tiếng là một trang tĩnh riêng ("/", "/vi", "/de"), nên chọn tiếng
 * khác là chuyển trang. Thiệp chưa mở và nhạc chưa bật, nên chuyển lúc này
 * không mất gì. Giữ nguyên `?to=` để link mời riêng vẫn gọi đúng tên khách.
 *
 * Chỉ hiện sau khi trang đã chạy trên trình duyệt (cần sessionStorage), nên
 * khi JS tắt khách vẫn thấy màn mở thiệp tiếng Anh như cũ.
 */
export function LanguagePicker() {
  const router = useRouter();
  const { opened } = useExperience();
  const { lang } = useLang();
  /* Trên server coi như đã chọn, để HTML tĩnh không có popup. */
  const picked = useSyncExternalStore(subscribeNever, readPicked, () => true);
  const [dismissed, setDismissed] = useState(false);
  const sheet = resolveBackground("paper-beige");

  useEffect(() => {
    for (const item of languages.list) router.prefetch(item.path);
  }, [router]);

  if (picked || dismissed || opened) return null;

  function choose(id: string, path: string) {
    writePicked();
    setDismissed(true);
    if (id !== lang) router.push(`${path}${window.location.search}`, { scroll: true });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 px-gutter backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={languages.label}
        data-tone="beige"
        className="sheet flex w-full max-w-sm flex-col items-center gap-block text-center"
      >
        {sheet ? (
          <Image
            src={sheet.src}
            alt=""
            aria-hidden
            fill
            sizes="24rem"
            className="-z-10 object-cover"
          />
        ) : null}

        {/* Khách chưa chọn tiếng nào, nên lời mời viết cả ba thứ tiếng. */}
        <div className="flex flex-col gap-tight">
          {languages.prompt.map((line, i) => (
            <p
              key={line}
              lang={languages.list[i]?.id}
              className={i === 0 ? "type-subtitle text-tone-fg" : "type-sub-body text-tone-muted"}
            >
              {line}
            </p>
          ))}
        </div>

        <div className="flex w-full flex-col gap-stack">
          {languages.list.map((item) => (
            <Button
              key={item.id}
              autoFocus={item.id === lang}
              lang={item.id}
              variant={item.id === lang ? "primary" : "ghost"}
              onClick={() => choose(item.id, item.path)}
              className="w-full"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
