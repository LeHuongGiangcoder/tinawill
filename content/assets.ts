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
  },

  /** Dải ngăn giữa hai section, lặp theo chiều ngang */
  dividers: {},
} as const;

export type TextureName = keyof typeof assets.textures;
export type BackgroundName = keyof typeof assets.backgrounds;
export type ElementName = keyof typeof assets.elements;
export type DividerName = keyof typeof assets.dividers;
