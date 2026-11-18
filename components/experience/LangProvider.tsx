"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

import type { Content, Lang } from "@/lib/content";

type LangValue = {
  lang: Lang;
  /** Chữ của màn mở thiệp — nằm sâu trong cảnh client nên đi qua context. */
  intro: Content["intro"];
};

const LangContext = createContext<LangValue | null>(null);

export function useLang() {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang phải nằm trong <LangProvider>");
  return value;
}

/**
 * Ngôn ngữ của trang đang xem, cho các component client.
 *
 * Server truyền xuống đúng phần chữ client cần (không phải cả ba bản dịch),
 * để bundle JS không phải chở chữ của những thứ tiếng khách không xem.
 *
 * `<html lang>` nằm ở root layout và không biết trang con là tiếng gì, nên
 * chỉnh lại ở đây cho trình đọc màn hình và tính năng dịch của trình duyệt.
 */
export function LangProvider({
  lang,
  htmlLang,
  intro,
  children,
}: LangValue & { htmlLang: string; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = htmlLang;
  }, [htmlLang]);

  return <LangContext.Provider value={{ lang, intro }}>{children}</LangContext.Provider>;
}
