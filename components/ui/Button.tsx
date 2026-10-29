import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "contrast" | "sun" | "icon";

/*
  `uppercase` KHÔNG nằm ở đây mà ở từng biến thể. Lý do là cascade: hai class
  cùng đặt `text-transform` thì thắng thua theo thứ tự sinh CSS chứ không theo
  thứ tự viết, nên một `normal-case` truyền từ ngoài vào sẽ thua `uppercase` ở
  BASE và không ai hiểu tại sao. Để biến thể tự quyết thì chỗ gọi không phải
  chống lại nó.
*/
const BASE =
  "inline-flex items-center justify-center gap-tight rounded-btn font-body text-eyebrow font-semibold transition-[transform,background-color,color] duration-200 ease-glow disabled:opacity-55 disabled:pointer-events-none";

/* Vùng chạm luôn >= 2.75rem (min-h-tap) để ngón tay bấm không trượt. */
const VARIANT: Record<Variant, string> = {
  primary:
    "uppercase min-h-tap min-w-full sm:min-w-[14rem] sm:w-auto px-block py-stack bg-tone-fg text-tone-bg border border-tone-fg shadow-paper hover:[@media(hover:hover)]:-translate-y-px",
  outline:
    "uppercase min-h-tap min-w-full sm:min-w-[14rem] sm:w-auto px-block py-stack border border-tone-line text-tone-fg hover:[@media(hover:hover)]:border-tone-accent",
  /* Nút nằm trên một mảng sáng bên trong section tối (hoặc ngược lại): lấy
     màu tương phản của tông thay vì màu chữ, nên nó vẫn nổi lên khỏi mảng đó
     chứ không chìm vào. `primary` ở trên dùng chính màu chữ nên sẽ biến mất.

     Khác hai biến thể trên, biến thể này KHÔNG tự đặt bề rộng: chỗ dùng nó là
     một cảnh ghép, nơi nút phải rộng đúng bằng nét vẽ bên dưới. Người gọi đặt
     bề rộng (thường là `w-full` trong một khối đã đúng cỡ). */
  contrast:
    "min-h-tap px-block py-stack bg-tone-contrast text-tone-bg border border-tone-contrast shadow-paper hover:[@media(hover:hover)]:-translate-y-px",
  /* Viên thuốc vàng nghệ vẽ sẵn trong một cảnh ghép: màu đứng ngoài hệ tông
     vì nó là một mảng đặc của bản vẽ, không phải màu của nền hay chữ (xem
     `sun` trong content/theme.ts). Như `contrast`, nó không tự đặt bề rộng —
     chỗ gọi cho nó rộng đúng bằng nét vẽ bên dưới. */
  sun: "min-h-tap px-block py-stack bg-sun text-ink border border-sun shadow-paper hover:[@media(hover:hover)]:-translate-y-px",
  icon: "uppercase size-tap min-w-tap border border-tone-line text-tone-fg bg-tone-bg/80 backdrop-blur-sm",
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
