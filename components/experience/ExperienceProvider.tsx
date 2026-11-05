"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { OPEN_EVENT } from "@/components/ui/Motion";
import { design, music } from "@/content/client";

type ExperienceValue = {
  /** Thiệp đã mở chưa — màn Intro ẩn đi và trang mở khoá cuộn khi true. */
  opened: boolean;
  /** Có file nhạc và phát được không. False thì nút nhạc tự ẩn. */
  hasAudio: boolean;
  musicOn: boolean;
  open: () => void;
  toggleMusic: () => void;
};

const ExperienceContext = createContext<ExperienceValue | null>(null);

export function useExperience() {
  const value = useContext(ExperienceContext);
  if (!value) throw new Error("useExperience phải nằm trong <ExperienceProvider>");
  return value;
}

/**
 * Giữ ba thứ đi liền nhau: cổng mở thiệp, nhạc nền, và khoá cuộn.
 *
 * Nhạc BẮT BUỘC phải được gọi play() ngay trong cú chạm mở thiệp — trình
 * duyệt trên điện thoại chặn mọi lần phát nhạc không sinh từ thao tác của
 * người dùng. Vì vậy `open()` vừa mở thiệp vừa bật nhạc, chứ không tách ra.
 *
 * `gated` = false (không có section "intro") thì trang mở sẵn, chỉ còn nút
 * nhạc và khách phải tự bấm để bật.
 */
export function ExperienceProvider({
  gated,
  children,
}: {
  gated: boolean;
  children: ReactNode;
}) {
  const [opened, setOpened] = useState(!gated);
  const [musicOn, setMusicOn] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const enabled = music.enabled && music.src !== "";

  // Luôn bắt đầu từ đầu trang, thay vì để trình duyệt nhớ vị trí cuộn cũ.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  /* Khoá cuộn khi thiệp chưa mở. Màn mở thiệp nằm trong Hero, mà phía trên
     Hero có thể còn trang bìa (Cover) — nên chỉ khoá khi khách cuộn tới Hero,
     và kéo họ về đúng đầu Hero để thấy trọn màn mở thiệp. */
  useEffect(() => {
    if (opened) {
      document.body.dataset.locked = "false";
      return;
    }
    const lockAtHero = () => {
      const hero = document.getElementById(design.hero.anchor);
      if (!hero || document.body.dataset.locked === "true") return;
      const top = hero.getBoundingClientRect().top;
      if (top <= 0) {
        window.scrollTo({ top: window.scrollY + top, behavior: "instant" });
        document.body.dataset.locked = "true";
      }
    };
    document.body.dataset.locked = "false";
    lockAtHero();
    window.addEventListener("scroll", lockAtHero, { passive: true });
    return () => {
      window.removeEventListener("scroll", lockAtHero);
      document.body.dataset.locked = "false";
    };
  }, [opened]);

  // Trang không có cổng mở thiệp: hero vẫn phải hiện, nên bắn sự kiện ngay.
  useEffect(() => {
    if (!gated) window.dispatchEvent(new Event(OPEN_EVENT));
  }, [gated]);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(music.src);
      audio.loop = true;
      audio.volume = music.volume;
      audio.addEventListener("canplaythrough", () => setHasAudio(true));
      // Chưa có file nhạc thì im lặng bỏ qua, không làm vỡ phần còn lại.
      audio.addEventListener("error", () => setHasAudio(false));
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const open = useCallback(() => {
    setOpened(true);
    window.dispatchEvent(new Event(OPEN_EVENT));
    if (!enabled) return;
    getAudio()
      .play()
      .then(() => {
        setHasAudio(true);
        setMusicOn(true);
      })
      .catch(() => setMusicOn(false));
  }, [enabled, getAudio]);

  const toggleMusic = useCallback(() => {
    if (!enabled) return;
    const audio = getAudio();
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      return;
    }
    audio
      .play()
      .then(() => {
        setHasAudio(true);
        setMusicOn(true);
      })
      .catch(() => setMusicOn(false));
  }, [enabled, getAudio, musicOn]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const value = useMemo(
    () => ({ opened, hasAudio: enabled && hasAudio, musicOn, open, toggleMusic }),
    [opened, enabled, hasAudio, musicOn, open, toggleMusic],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
