import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import localFont from "next/font/local";

import { meta } from "@/content/client";
import { palette, themeCssVars } from "@/content/theme";
import "./globals.css";

/*
  Hai font của khách, lấy thẳng từ bản Canva. File nằm ở app/fonts (không phải
  public/) để next/font tự host, tự đặt tên vân tay và nạp bằng <link rel=
  "preload"> — để trong public thì trình duyệt phải đợi CSS phân tích xong mới
  biết mà tải.

  IM Fell English khai cả italic thật: ba dòng chữ trong section Venue đều
  nghiêng, mà italic giả do trình duyệt kéo xiên làm hỏng nét khắc gỗ của bộ
  chữ này (và làm méo dấu nếu sau có chữ tiếng Việt lọt vào).
*/
const display = localFont({
  variable: "--ff-display",
  display: "swap",
  src: [
    { path: "./fonts/IMFellEnglish-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/IMFellEnglish-Italic.ttf", weight: "400", style: "italic" },
  ],
});

const script = localFont({
  variable: "--ff-script",
  display: "swap",
  src: [{ path: "./fonts/LeckerliOne-Regular.ttf", weight: "400", style: "normal" }],
});

/*
  Hai font đỡ cho tiếng Việt. IM Fell và Leckerli One không có `ơ ư đ` hay dấu
  chồng, nên chúng đứng ngay sau trong stack ở content/theme.ts: trình duyệt
  chỉ dùng tới ở đúng ký tự còn thiếu. Khách không tải thêm byte nào nếu trang
  toàn chữ tiếng Anh — font chỉ tải khi có ký tự cần tới nó.
*/
const displayVn = Cormorant_Garamond({
  variable: "--ff-display-vn",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const scriptVn = Pinyon_Script({
  variable: "--ff-script-vn",
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
});

/* Chữ chạy trong trang: Be Vietnam Pro có đủ subset "vietnamese". */
const body = Be_Vietnam_Pro({
  variable: "--ff-body",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    locale: meta.locale,
    images: [{ url: meta.ogImage }],
  },
  twitter: { card: "summary_large_image", images: [meta.ogImage] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Cho layout chạm tới sát tai thỏ — đó là điều làm env(safe-area-inset-*)
     trong globals.css có tác dụng. */
  viewportFit: "cover",
  themeColor: palette.cream,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={meta.lang}
      className={`${display.variable} ${body.variable} ${script.variable} ${displayVn.variable} ${scriptVn.variable}`}
    >
      <head>
        {/* Token của content/theme.ts, in ra dưới dạng CSS variable */}
        <style>{themeCssVars()}</style>
        {/* JS tắt thì không ai làm chúng hiện — trả lại opacity ngay */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
