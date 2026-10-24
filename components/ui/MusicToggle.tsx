"use client";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { music } from "@/content/client";

/**
 * Nút bật/tắt nhạc, nổi ở góc dưới phải. Chỉ hiện sau khi thiệp đã mở và
 * file nhạc phát được; kê trên vạch home của iPhone bằng safe-area.
 */
export function MusicToggle() {
  const { opened, hasAudio, musicOn, toggleMusic } = useExperience();

  if (!opened || !hasAudio) return null;

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-pressed={musicOn}
      aria-label={musicOn ? `Tắt nhạc: ${music.title}` : `Bật nhạc: ${music.title}`}
      className="fixed z-50 flex size-tap items-center justify-center rounded-btn border border-line bg-surface/85 text-ink shadow-paper backdrop-blur-sm"
      style={{
        right: "max(var(--t-space-gutter), env(safe-area-inset-right))",
        bottom: "calc(var(--t-space-stack) + env(safe-area-inset-bottom))",
      }}
    >
      <span aria-hidden className={`flex h-4 items-end gap-[3px] ${musicOn ? "" : "opacity-45"}`}>
        <i className="block h-2 w-[2px] bg-current" />
        <i className="block h-4 w-[2px] bg-current" />
        <i className="block h-3 w-[2px] bg-current" />
      </span>
    </button>
  );
}
