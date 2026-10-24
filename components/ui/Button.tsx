import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "icon";

const BASE =
  "inline-flex items-center justify-center gap-tight rounded-btn font-body text-eyebrow font-semibold uppercase transition-[transform,background-color,color] duration-200 ease-glow disabled:opacity-55 disabled:pointer-events-none";

/* Vùng chạm luôn >= 2.75rem (min-h-tap) để ngón tay bấm không trượt. */
const VARIANT: Record<Variant, string> = {
  primary:
    "min-h-tap min-w-full sm:min-w-[14rem] sm:w-auto px-block py-stack bg-tone-fg text-tone-bg border border-tone-fg shadow-paper hover:[@media(hover:hover)]:-translate-y-px",
  outline:
    "min-h-tap min-w-full sm:min-w-[14rem] sm:w-auto px-block py-stack border border-tone-line text-tone-fg hover:[@media(hover:hover)]:border-tone-accent",
  icon: "size-tap min-w-tap border border-tone-line text-tone-fg bg-tone-bg/80 backdrop-blur-sm",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };

/** Nút bấm. Màu lấy từ tông của section đang bọc nó. */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${BASE} ${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/** Cùng hình dáng với Button nhưng là thẻ <a> — dùng cho link Maps, lịch. */
export function ButtonLink({
  variant = "outline",
  className = "",
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${BASE} ${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
