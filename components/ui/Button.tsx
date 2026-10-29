import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/*
  Hình dáng và màu của nút nằm ở `.btn` trong app/globals.css; màu thì lấy
  theo tông của section đang bọc nút (`button` / `buttonText` trong
  content/theme.ts). Vì vậy ở đây chỉ còn chọn nút chính hay nút phụ — không
  có biến thể màu nào, đổi màu nút của một section là đổi tông của nó.
*/
type Variant = "primary" | "ghost";

const VARIANT: Record<Variant, string> = {
  primary: "btn",
  ghost: "btn btn-ghost",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };

/** Nút bấm. */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/** Cùng hình dáng với Button nhưng là thẻ <a> — dùng cho link Maps, lịch. */
export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
