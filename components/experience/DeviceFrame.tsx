"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Trên desktop, khách xem thiệp trong một khung điện thoại giữa màn hình.
 *
 * Khung là một iframe trỏ về chính trang này: bên trong iframe bề ngang là
 * 430px, nên `vw`, `svh` và các breakpoint `md:` chạy y như trên điện thoại —
 * ép bề rộng bằng CSS thì không làm được vậy. Trang trong iframe thấy mình
 * không phải cửa sổ trên cùng nên render site bình thường.
 *
 * Điều kiện "desktop" phải giống hệt DEVICE_QUERY trong script ở layout.tsx.
 */
export const DEVICE_QUERY = "(min-width: 56rem) and (hover: hover) and (pointer: fine)";

/** Chạy trong <head> trước khi vẽ: đánh dấu để CSS giấu bản site to. */
export const deviceFrameScript = `try{if(window.self===window.top&&matchMedia(${JSON.stringify(
  DEVICE_QUERY,
)}).matches)document.documentElement.dataset.device="frame"}catch(e){}`;

export function DeviceFrame({ children }: { children: React.ReactNode }) {
  const [src, setSrc] = useState<string | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (window.self !== window.top) return;
    const media = window.matchMedia(DEVICE_QUERY);
    const sync = () => {
      if (media.matches) {
        document.documentElement.dataset.device = "frame";
        setSrc((current) => current ?? window.location.href);
      } else {
        delete document.documentElement.dataset.device;
        setSrc(null);
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  /* Lăn chuột ở hai bên khung cũng cuộn thiệp, không bắt khách rê vào giữa. */
  useEffect(() => {
    if (!src) return;
    const onWheel = (event: WheelEvent) => {
      const inner = frameRef.current?.contentWindow;
      if (!inner || event.target === frameRef.current) return;
      inner.scrollBy({ top: event.deltaY, left: 0 });
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [src]);

  /* Giữ thanh địa chỉ theo trang trong khung (đổi tiếng /vi, /de, neo #…) để
     copy link ra là đúng trang khách đang xem. */
  const onLoad = () => {
    try {
      const inner = frameRef.current?.contentWindow;
      if (!inner) return;
      const follow = () => window.history.replaceState(null, "", inner.location.href);
      follow();
      inner.addEventListener("hashchange", follow);
    } catch {
      /* khác origin — bỏ qua */
    }
  };

  if (!src) return <>{children}</>;

  return (
    <div className="device-stage">
      <iframe
        ref={frameRef}
        src={src}
        title={typeof document === "undefined" ? "" : document.title}
        className="device-screen"
        allow="autoplay; fullscreen; clipboard-write"
        onLoad={onLoad}
      />
    </div>
  );
}
