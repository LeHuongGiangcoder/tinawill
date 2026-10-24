import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, Pinyon_Script } from "next/font/google";

import { meta } from "@/content/client";
import { palette, themeCssVars } from "@/content/theme";
import "./globals.css";

/*
  Cả ba font đều phải có subset "vietnamese", nếu không dấu tiếng Việt sẽ rơi
  về font hệ thống và chữ bị lệch nét giữa các từ.

  Cormorant khai báo cả italic thật: italic giả do trình duyệt kéo nghiêng làm
  méo dấu (dấu huyền trong "và" biến thành dấu móc).
*/
const display = Cormorant_Garamond({
  variable: "--ff-display",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Be_Vietnam_Pro({
  variable: "--ff-body",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const script = Pinyon_Script({
  variable: "--ff-script",
  subsets: ["latin", "vietnamese"],
  weight: "400",
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
      className={`${display.variable} ${body.variable} ${script.variable}`}
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
