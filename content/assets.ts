/**
 * TỰ SINH — đừng sửa tay. Chạy `npm run assets` để dựng lại.
 *
 * Bản kê những gì đang có trong brand/. Nguồn thật nằm ở brand/, bản chép để
 * phục vụ nằm ở public/brand/. Gắn asset vào section ở `design` trong
 * content/client.ts; TypeScript sẽ bắt lỗi nếu gõ sai tên.
 */

export const assets = {
  /** Vân giấy / hoạ tiết lặp, trải kín nền section */
  textures: {
    "stripe-olive": { src: "/brand/textures/stripe-olive.webp", width: 133, height: 1672 },
    "stripe-vermilion": { src: "/brand/textures/stripe-vermilion.webp", width: 133, height: 1672 },
  },

  /** Ảnh nền full-bleed của một section */
  backgrounds: {
    "paper-beige": { src: "/brand/backgrounds/paper-beige.webp", width: 1200, height: 2133 },
    "paper-mango": { src: "/brand/backgrounds/paper-mango.webp", width: 1200, height: 2132 },
    "paper-olive": { src: "/brand/backgrounds/paper-olive.webp", width: 1200, height: 2133 },
    "paper-vermilion": { src: "/brand/backgrounds/paper-vermilion.webp", width: 1200, height: 2132 },
    "paper-wine": { src: "/brand/backgrounds/paper-wine.webp", width: 1200, height: 2132 },
  },

  /** Hoạ tiết rời (hoa, ruy băng, con dấu) — nền trong suốt */
  elements: {
    "flag-asean": { src: "/brand/elements/flag-asean.webp", width: 320, height: 199 },
    "flag-eu": { src: "/brand/elements/flag-eu.webp", width: 320, height: 199 },
    "flag-hongkong": { src: "/brand/elements/flag-hongkong.webp", width: 320, height: 199 },
    "flag-india": { src: "/brand/elements/flag-india.webp", width: 320, height: 199 },
    "flag-maldives": { src: "/brand/elements/flag-maldives.webp", width: 320, height: 199 },
    "flag-usa": { src: "/brand/elements/flag-usa.webp", width: 320, height: 163 },
    "honeymoon-jar": { src: "/brand/elements/honeymoon-jar.webp", width: 883, height: 1331 },
    "lantern-01": { src: "/brand/elements/lantern-01.webp", width: 365, height: 2051 },
    "lantern-02": { src: "/brand/elements/lantern-02.webp", width: 322, height: 2015 },
    "lantern-03": { src: "/brand/elements/lantern-03.webp", width: 235, height: 2203 },
    "lantern-04": { src: "/brand/elements/lantern-04.webp", width: 300, height: 2120 },
    "lantern-05": { src: "/brand/elements/lantern-05.webp", width: 322, height: 2087 },
    "lantern-06": { src: "/brand/elements/lantern-06.webp", width: 343, height: 2105 },
    "lantern-07": { src: "/brand/elements/lantern-07.webp", width: 230, height: 2078 },
    "lantern-08": { src: "/brand/elements/lantern-08.webp", width: 302, height: 2052 },
    "lantern-09": { src: "/brand/elements/lantern-09.webp", width: 278, height: 1975 },
    "lantern-10": { src: "/brand/elements/lantern-10.webp", width: 283, height: 1944 },
    "lantern-11": { src: "/brand/elements/lantern-11.webp", width: 187, height: 1906 },
    "lotus-01": { src: "/brand/elements/lotus-01.webp", width: 301, height: 280 },
    "lotus-02": { src: "/brand/elements/lotus-02.webp", width: 390, height: 373 },
    "lotus-03": { src: "/brand/elements/lotus-03.webp", width: 400, height: 298 },
    "lotus-04": { src: "/brand/elements/lotus-04.webp", width: 368, height: 261 },
    "lotus-05": { src: "/brand/elements/lotus-05.webp", width: 311, height: 324 },
    "lotus-06": { src: "/brand/elements/lotus-06.webp", width: 411, height: 360 },
    "lotus-07": { src: "/brand/elements/lotus-07.webp", width: 319, height: 323 },
    "lotus-08": { src: "/brand/elements/lotus-08.webp", width: 329, height: 277 },
    "lotus-09": { src: "/brand/elements/lotus-09.webp", width: 356, height: 368 },
    "lotus-10": { src: "/brand/elements/lotus-10.webp", width: 336, height: 298 },
    "vine-trail": { src: "/brand/elements/vine-trail.webp", width: 1100, height: 382 },
  },

  /** Dải ngăn giữa hai section, lặp theo chiều ngang */
  dividers: {},
} as const;

export type TextureName = keyof typeof assets.textures;
export type BackgroundName = keyof typeof assets.backgrounds;
export type ElementName = keyof typeof assets.elements;
export type DividerName = keyof typeof assets.dividers;
