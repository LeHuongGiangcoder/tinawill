import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { Reveal } from "./Reveal";

type Level = "display" | "h1" | "h2" | "h3" | "h4";

/*
  h3 là tiêu đề một khối trong trang — bậc `subtitle` của hệ chữ. h4 là tên
  một mục nhỏ hơn thế (tên một mốc trong agenda) — bậc `body`, cùng cỡ với chữ
  chạy để nó đọc liền với ghi chú ngay dưới.
*/
const LEVEL_CLASS: Record<Level, string> = {
  display: "font-display text-display",
  h1: "font-display text-h1",
  h2: "font-display text-h2",
  h3: "type-subtitle",
  h4: "type-body",
};

const LEVEL_TAG: Record<Level, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
};

/*
  Mọi component chữ đều nhận thêm attribute thường (data-reveal, data-hero,
  aria-*) và chuyển xuống thẻ thật, nên section không phải bọc thêm một lớp
  <div> chỉ để gắn attribute cho GSAP.
*/
type TextProps = HTMLAttributes<HTMLElement> & { className?: string; children: ReactNode };

/** Xem chú thích của `Subhead`. */
type SubheadVariant = "sentence" | "motif";

const SUBHEAD_CLASS: Record<SubheadVariant, string> = {
  sentence: "type-sub-body",
  motif: "type-subtitle",
};

/** Tiêu đề. Cỡ chữ chỉ được lấy từ thang trong content/theme.ts. */
export function Heading({
  level = "h2",
  as,
  className = "",
  children,
  ...rest
}: TextProps & { level?: Level; as?: ElementType }) {
  const Tag = as ?? LEVEL_TAG[level];
  return (
    <Tag className={`${LEVEL_CLASS[level]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/** Dòng chữ nhỏ in hoa đứng trên tiêu đề. */
export function Eyebrow({
  as: Tag = "p",
  className = "",
  children,
  ...rest
}: TextProps & { as?: ElementType }) {
  return (
    <Tag
      className={`font-body text-eyebrow font-medium uppercase text-tone-accent ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Đoạn dẫn dưới tiêu đề — bậc `body` của hệ chữ, màu chữ phụ. */
export function Lead({ className = "", children, ...rest }: TextProps) {
  return (
    <p className={`type-body text-tone-muted ${className}`} {...rest}>
      {children}
    </p>
  );
}

/** Ghi chú nhỏ: hạn chót, chú thích dưới một mục — bậc `note` của hệ chữ. */
export function Caption({ className = "", children, ...rest }: TextProps) {
  return (
    <p className={`type-note text-tone-muted ${className}`} {...rest}>
      {children}
    </p>
  );
}

/**
 * Tiêu đề của một section — font viết tay, cùng một kiểu với hai cảnh dựng
 * sẵn "Save the Date" và "Our wedding venue".
 *
 * Không dùng <Heading> ở đây: Heading luôn kèm sẵn `font-display`, mà hai cặp
 * class cùng thuộc tính chồng nhau thì thắng thua phụ thuộc thứ tự sinh CSS,
 * không phải thứ tự viết. Thẻ <h2> viết thẳng cùng `font-script` thì luôn
 * đúng, và `@layer base` trong globals.css đã nhường cho utility.
 *
 * Màu lấy `text-tone-title` — màu tiêu đề riêng của mỗi tông (xem `tones` trong
 * content/theme.ts): beige trên mọi nền đậm, màu chữ của tông trên nền sáng —
 * nên cùng một kiểu chữ đổi màu theo nền mà không cần truyền prop.
 */
export function SectionTitle({
  as: Tag = "h2",
  className = "",
  children,
  ...rest
}: TextProps & { as?: ElementType }) {
  return (
    <Tag className={`type-title text-tone-title ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Dòng dẫn đứng ngay dưới tiêu đề section — bậc thứ hai của đầu section.
 *
 * Màu nhấn: đủ khác `SectionTitle` để không tranh chỗ với nó, mà vẫn tách
 * hẳn khỏi `Lead` (màu chữ phụ) ở ngay dưới.
 *
 * Hai biến thể, mỗi cái một bậc của hệ chữ (xem `typeScale` trong theme.ts):
 *
 *   sentence  mặc định — một câu nói rõ tiêu đề ("Whichever passport…"),
 *             bậc `sub-body`: in nghiêng, nhỏ hơn đoạn dẫn
 *   motif     TÊN của một thứ ("Jungle Glam") — bậc `subtitle`
 *
 * Chọn biến thể theo nội dung dòng chữ, không theo "section này muốn chữ to
 * hơn": một câu dài đặt ở `motif` sẽ nuốt mất tiêu đề ngay trên nó.
 */
export function Subhead({
  as: Tag = "p",
  variant = "sentence",
  className = "",
  children,
  ...rest
}: TextProps & { as?: ElementType; variant?: SubheadVariant }) {
  return (
    <Tag className={`${SUBHEAD_CLASS[variant]} text-tone-accent ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/** Chữ viết tay — dành cho lời ký và một hai câu nhấn. Cỡ bằng bậc `subtitle`. */
export function Script({ className = "", children, ...rest }: TextProps) {
  return (
    <p className={`font-script text-subtitle text-tone-accent ${className}`} {...rest}>
      {children}
    </p>
  );
}

/**
 * Đầu section — bậc chữ của cả site gom về một chỗ.
 *
 * Mọi section đi qua khối này, nên thứ tự và khoảng cách luôn khớp nhau:
 *
 *   eyebrow   chữ nhỏ in hoa, màu nhấn      — section này là gì
 *   title     tiêu đề viết tay, màu chữ     — tên section
 *   subtitle  dòng dẫn in nghiêng, màu nhấn — một câu nói rõ tiêu đề
 *   intro     đoạn dẫn, màu chữ phụ         — nội dung
 *
 * Ba dòng trên đều tuỳ chọn, nhưng khi có thì luôn đứng đúng thứ tự này: nửa
 * trang là chữ dẫn rồi mới tới nội dung, nên đổi thứ tự ở một section là mất
 * nhịp của cả trang.
 */
export function SectionHead({
  eyebrow,
  title,
  titleId,
  subtitle,
  subtitleVariant = "sentence",
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  titleId?: string;
  subtitle?: string;
  /** "motif" khi `subtitle` là tên của một thứ chứ không phải một câu — xem `Subhead`. */
  subtitleVariant?: SubheadVariant;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mb-block flex flex-col items-center gap-tight text-center">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <SectionTitle id={titleId}>{title}</SectionTitle>
      {subtitle ? (
        <Subhead variant={subtitleVariant} className="max-w-prose">
          {subtitle}
        </Subhead>
      ) : null}
      {intro ? <Lead className="max-w-prose text-balance">{intro}</Lead> : null}
      {children}
    </Reveal>
  );
}
