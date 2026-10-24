"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { rsvp } from "@/content/client";

export type Guest = {
  slug: string;
  name: string;
  /** Kiểu thiệp, khớp cột "Invitation type" trong Sheet của Glow RSVP Hub. */
  type: "general" | "intimate";
};

type GuestState = {
  /** null = khách vào thẳng trang chủ, không qua link mời riêng. */
  guest: Guest | null;
  /** Đang hỏi hub — dùng để không nháy chữ "Thân mời …" rồi lại mất. */
  loading: boolean;
};

const GuestContext = createContext<GuestState>({ guest: null, loading: false });

const subscribeNever = () => () => {};
/** Đọc `?to=` thẳng từ thanh địa chỉ; trên server không có URL nên trả null. */
const readSlug = () => new URLSearchParams(window.location.search).get("to");

/**
 * Chỉ có tác dụng khi `rsvp.mode === "personalized"`: tra tên khách từ Glow
 * RSVP Hub theo slug trong link mời. Hub trả `{ ok, name, type }`.
 *
 * Tra không ra (slug sai, hub chưa nối) thì coi như khách thường — trang vẫn
 * chạy đủ, chỉ không gọi tên.
 */
export function GuestProvider({ children }: { children: ReactNode }) {
  const slug = useSyncExternalStore(subscribeNever, readSlug, () => null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [failed, setFailed] = useState(false);

  const active = rsvp.mode === "personalized" && rsvp.endpoint !== "" && rsvp.client !== "";

  useEffect(() => {
    if (!active || !slug) return;

    // Khách có thể đóng tab giữa chừng — cờ này chặn setState sau khi gỡ.
    let alive = true;
    const url = `${rsvp.endpoint}?client=${encodeURIComponent(rsvp.client)}&slug=${encodeURIComponent(slug)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data: { ok?: boolean; name?: string; type?: string }) => {
        if (!alive) return;
        if (!data?.ok || !data.name) {
          setFailed(true);
          return;
        }
        setGuest({
          slug,
          name: data.name,
          type: data.type === "intimate" ? "intimate" : "general",
        });
      })
      .catch(() => {
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
    };
  }, [active, slug]);

  const value = useMemo(
    () => ({ guest, loading: Boolean(active && slug) && !guest && !failed }),
    [active, slug, guest, failed],
  );

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}

export function useGuest() {
  return useContext(GuestContext);
}
