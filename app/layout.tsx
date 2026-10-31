import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
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
  Font đỡ cho tiếng Việt — họ thứ ba và cuối cùng của site. IM Fell và Leckerli
  One không có `ơ ư đ` hay dấu chồng, nên Cormorant Garamond đứng ngay sau
  chúng trong stack ở content/theme.ts: trình duyệt chỉ dùng tới ở đúng ký tự
  còn thiếu. Khách không tải thêm byte nào nếu trang toàn chữ tiếng Anh.

  Site chỉ có ba họ chữ: Leckerli One (tiêu đề), IM Fell English (chữ chạy +
  nghiêng) và Cormorant (chỉ dấu tiếng Việt). Đừng thêm họ thứ tư.
*/
const displayVn = Cormorant_Garamond({
  variable: "--ff-display-vn",
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  style: ["normal", "italic"],
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
      className={`${display.variable} ${script.variable} ${displayVn.variable}`}
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
