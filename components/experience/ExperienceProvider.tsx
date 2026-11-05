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
import { music } from "@/content/client";

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

  // Khoá cuộn khi thiệp chưa mở.
  useEffect(() => {
    document.body.dataset.locked = opened ? "false" : "true";
    return () => {
      document.body.dataset.locked = "false";
    };
  }, [opened]);

  // Trang không có cổng mở thiệp: hero vẫn phải hiện, nên bắn sự kiện ngay.
  useEffect(() => {
    if (!gated) window.dispatchEvent(new Event(OPEN_EVENT));
  }, [gated]);

  // Luôn bắt đầu từ đầu trang, thay vì để trình duyệt nhớ vị trí cuộn cũ.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

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
