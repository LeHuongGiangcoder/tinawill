/**
 * HỆ THỐNG THIẾT KẾ — nguồn duy nhất cho màu, chữ và khoảng cách.
 *
 * Mọi giá trị ở đây được layout.tsx in ra thành CSS variable trên :root, và
 * app/globals.css map chúng vào utility của Tailwind (`bg-cream`, `py-section`,
 * `text-h2`…). Nghĩa là:
 *
 *   • Đổi màu / font / nhịp khoảng cách của cả site → sửa DUY NHẤT file này.
 *   • Component KHÔNG được viết số padding/margin cứng. Luôn dùng utility đã
 *     map sẵn: px-gutter, py-section, gap-block, gap-stack, gap-tight.
 *
 * Khoảng cách viết theo mobile-first: số đầu trong clamp() là giá trị trên
 * điện thoại, số cuối là trên desktop, ở giữa là nhịp giãn theo chiều rộng.
 * Breakpoint dùng chung (khớp mặc định Tailwind):
 *   sm 40rem/640px · md 48rem/768px · lg 64rem/1024px · xl 80rem/1280px
 * Thêm biến thể `short:` cho máy nằm ngang (max-height 32rem).
 */

/* ---------------------------------------------------------------- PALETTE */

/*
  Bảng màu "Jungle Glam" của Tina & Will: xanh rừng, cam cháy, đỏ vang.
  Tên token giữ nguyên theo khung nền (cream / forest / gold) để globals.css
  và component không phải đổi — chỉ giá trị đổi.

  Mọi cặp màu chữ/nền ở đây đều đạt WCAG AA: cam cháy trên kem 5.37:1, cam
  nhạt trên xanh rừng 6.84:1, chữ nhạt trên kem đậm 4.73:1.
*/
export const palette = {
  /** Nền chính của trang và của các section sáng */
  cream: "#fbf6ee",
  creamDeep: "#f3e6d5",
  /** Nền của các section tối — xanh rừng */
  forest: "#273a2c",
  forestDeep: "#18261c",
  forestSoft: "#4a6b4f",
  /** Chữ trên nền sáng */
  ink: "#332e28",
  inkSoft: "#6d6457",
  /** Nhấn: cam cháy cho nền sáng, cam nhạt cho nền tối */
  gold: "#a8491f",
  goldSoft: "#eab98d",
  /** Nền thẻ, khung ảnh */
  surface: "#ffffff",
  line: "#ddcdb8",
  /** Giấy ô liu — màu nền của cảnh Venue, lấy từ chính file tranh khách gửi */
  olive: "#516403",
} as const;

/**
 * Bảng màu theo "tông" của section. SectionWrapper nhận `tone` và đặt
 * --section-bg / --section-fg / --section-accent, nên nút, gạch, input bên
 * trong tự đổi màu theo section mà không cần truyền prop.
 */
export const tones = {
  light: {
    bg: palette.cream,
    fg: palette.ink,
    muted: palette.inkSoft,
    accent: palette.gold,
    line: palette.line,
    contrast: palette.forest,
  },
  paper: {
    bg: palette.creamDeep,
    fg: palette.ink,
    muted: palette.inkSoft,
    accent: palette.gold,
    line: palette.line,
    contrast: palette.forest,
  },
  dark: {
    bg: palette.forest,
    fg: palette.cream,
    muted: palette.goldSoft,
    accent: palette.goldSoft,
    line: "rgba(251, 247, 240, 0.28)",
    contrast: palette.cream,
  },
  /**
   * Tông của cảnh vẽ trên giấy ô liu (section Venue).
   *
   * Lý do nó tồn tại chứ không dùng chung `dark`: nền section phải trùng ĐÚNG
   * màu giấy trong file tranh. Lớp tranh tải trễ (ảnh giữa trang, lazy-load),
   * nên trong khoảnh khắc chưa tải xong khách nhìn thấy màu nền trần — trùng
   * màu thì không ai nhận ra, lệch màu thì section loé một mảng xanh đậm rồi
   * mới đổi sang ô liu.
   *
   * Cam nhạt (goldSoft) chỉ đạt 3.7:1 trên nền ô liu nên không dùng làm chữ
   * nhấn ở đây; cả `muted` lẫn `accent` đều lấy sắc kem — thấp nhất 5.3:1.
   */
  olive: {
    bg: palette.olive,
    fg: palette.cream,
    muted: palette.creamDeep,
    accent: palette.creamDeep,
    line: "rgba(251, 247, 240, 0.28)",
    contrast: palette.cream,
  },
} as const;

export type Tone = keyof typeof tones;

/* ------------------------------------------------------------- TYPOGRAPHY */

/**
 * Ba họ chữ. Giá trị là CSS variable do next/font sinh ra trong layout.tsx
 * (--ff-display / --ff-body / --ff-script) — đổi font thì sửa cả hai nơi.
 *
 * Tina & Will dùng hai font khách gửi: IM Fell English cho tiêu đề, Leckerli
 * One cho chữ viết tay. Cả hai KHÔNG có dấu tiếng Việt.
 *
 * Vì thế mỗi stack có thêm một font đỡ ngay phía sau: --ff-display-vn
 * (Cormorant Garamond) và --ff-script-vn (Pinyon Script), đều có subset
 * "vietnamese". Trình duyệt chỉ rơi sang chúng ở đúng những ký tự font trước
 * không có, nên site tiếng Anh vẫn đọc nguyên nét Canva, còn một chữ "Cảm ơn"
 * lọt vào thì ra dấu đúng thay vì vỡ thành ô vuông.
 *
 * Quy tắc cũ vẫn giữ: font không có subset "vietnamese" thì không bao giờ
 * đứng một mình trong stack.
 */
export const fonts = {
  display: 'var(--ff-display), var(--ff-display-vn), Georgia, "Times New Roman", serif',
  body: "var(--ff-body), ui-sans-serif, system-ui, sans-serif",
  script: 'var(--ff-script), var(--ff-script-vn), "Apple Chancery", cursive',
} as const;

/**
 * Thang chữ. Không được dùng size nào ngoài danh sách này.
 *
 * Nhịp dòng của bốn bậc tiêu đề đo theo hộp dòng của font tiêu đề. IM Fell
 * English cao 1.27em (ascender 0.91em + descender 0.36em) — rộng hơn Cormorant
 * ở bản trước (1.15em), nên line-height phải nới theo: dưới 1.02 thì chữ `g`
 * của dòng trên chạm đầu chữ hoa của dòng dưới.
 *
 * Đổi font tiêu đề thì đo lại hộp dòng rồi chỉnh bốn số này — đừng vá bằng
 * line-height rời trong từng section.
 */
export const typeScale = {
  display: { size: "clamp(3rem, 12vw, 7rem)", line: "1.02", tracking: "-0.015em" },
  h1: { size: "clamp(2.5rem, 8vw, 4.75rem)", line: "1.05", tracking: "-0.01em" },
  h2: { size: "clamp(1.875rem, 5.2vw, 3rem)", line: "1.14", tracking: "-0.005em" },
  h3: { size: "clamp(1.375rem, 3.2vw, 2rem)", line: "1.22", tracking: "0em" },
  h4: { size: "clamp(1.125rem, 2.2vw, 1.375rem)", line: "1.32", tracking: "0em" },
  lead: { size: "clamp(1.0625rem, 1.5vw, 1.1875rem)", line: "1.65", tracking: "0em" },
  body: { size: "1rem", line: "1.7", tracking: "0em" },
  small: { size: "0.875rem", line: "1.6", tracking: "0em" },
  /** Dòng chữ nhỏ in hoa trên tiêu đề section */
  eyebrow: { size: "0.75rem", line: "1.2", tracking: "0.26em" },
} as const;

export const weights = {
  body: "400",
  bodyMedium: "500",
  bodyBold: "600",
  display: "400",
} as const;

/**
 * Thang chữ thứ hai, chỉ dùng bên trong một cảnh dựng sẵn ở tỉ lệ dọc
 * (`.stage-9x16` trong app/globals.css).
 *
 * Vì sao cần bậc riêng: thang ở trên đo theo `vw` — bề rộng màn hình. Trong
 * một cảnh 9/16 thì khung hẹp hơn màn hình trên desktop, nên chữ đo theo `vw`
 * sẽ phình to hơn tranh. Đơn vị `cqw` đo theo bề rộng của chính khung cảnh,
 * nên chữ và tranh giữ đúng tỉ lệ với nhau ở mọi bề rộng màn hình.
 *
 * Con số cqw lấy thẳng từ bản Canva (khung gốc 1080px): tiêu đề 119.5px =
 * 11.07% bề rộng khung, tên nơi tổ chức 69.8px = 6.46%, và cứ thế. Hai đầu
 * clamp là sàn và trần: dưới sàn thì chữ không còn đọc được trên máy hẹp,
 * trên trần thì cảnh trông như áp phích phóng to.
 */
export const stageScale = {
  title: { size: "clamp(2.25rem, 11.07cqw, 4.5rem)", line: "1.25" },
  heading: { size: "clamp(1.5rem, 6.46cqw, 2.75rem)", line: "1.15" },
  lead: { size: "clamp(1rem, 3.7cqw, 1.5rem)", line: "1.2" },
  caption: { size: "clamp(0.875rem, 3.09cqw, 1.25rem)", line: "1.3" },
  action: { size: "clamp(0.8125rem, 3.39cqw, 1.125rem)", line: "1.2" },
} as const;

/* ---------------------------------------------------------------- SPACING */

/**
 * Nhịp dọc của trang. Chỉ có năm bậc — mọi khoảng cách trong site phải rơi
 * vào một trong năm bậc này.
 *
 *   gutter  lề ngang của container (đã cộng safe-area cho máy có tai thỏ)
 *   section khoảng cách trên/dưới của một section
 *   block   khoảng cách giữa hai khối lớn trong cùng section
 *   stack   khoảng cách giữa các phần tử trong một khối
 *   tight   khoảng cách giữa các dòng chữ đi liền nhau
 */
export const spacing = {
  gutter: "clamp(1.25rem, 5vw, 3rem)",
  section: "clamp(3.5rem, 9vw, 8rem)",
  block: "clamp(2rem, 5vw, 4rem)",
  stack: "1.25rem",
  tight: "0.625rem",
} as const;

export const sizes = {
  /** Vùng chạm tối thiểu — WCAG 2.5.8 / iOS HIG */
  tap: "2.75rem",
  /** Nút dùng chung một bề rộng để không so le khi đứng cạnh nhau */
  btn: "14rem",
  containerSite: "72rem",
  containerProse: "40rem",
} as const;

export const radius = {
  paper: "2px",
  card: "8px",
  btn: "999px",
} as const;

export const shadow = {
  paper: "0 10px 28px -14px rgb(51 48 42 / 0.3)",
  lift: "0 22px 50px -22px rgb(51 48 42 / 0.45)",
} as const;

/* ----------------------------------------------------------------- MOTION */

export const motion = {
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  durationFast: "200ms",
  durationBase: "420ms",
  durationSlow: "900ms",
  /** GSAP đọc hai số này trong components/ui/Motion.tsx */
  revealDistance: 28,
  revealStagger: 0.12,
} as const;

/* -------------------------------------------------- CSS VARIABLE EXPORTER */

/**
 * Dựng khối `:root { … }` từ các token ở trên. layout.tsx chèn chuỗi này vào
 * một thẻ <style>, nên không cần build step và không cần sửa CSS khi đổi theme.
 */
export function themeCssVars(): string {
  const lines: string[] = [];
  const push = (name: string, value: string) => lines.push(`  --t-${name}: ${value};`);

  for (const [key, value] of Object.entries(palette)) {
    push(`color-${kebab(key)}`, value);
  }

  push("font-display", fonts.display);
  push("font-body", fonts.body);
  push("font-script", fonts.script);

  for (const [key, step] of Object.entries(typeScale)) {
    push(`text-${kebab(key)}`, step.size);
    push(`leading-${kebab(key)}`, step.line);
    push(`tracking-${kebab(key)}`, step.tracking);
  }

  for (const [key, step] of Object.entries(stageScale)) {
    push(`text-stage-${kebab(key)}`, step.size);
    push(`leading-stage-${kebab(key)}`, step.line);
  }

  for (const [key, value] of Object.entries(weights)) {
    push(`weight-${kebab(key)}`, value);
  }

  for (const [key, value] of Object.entries(spacing)) {
    push(`space-${kebab(key)}`, value);
  }

  for (const [key, value] of Object.entries(sizes)) {
    push(`size-${kebab(key)}`, value);
  }

  for (const [key, value] of Object.entries(radius)) {
    push(`radius-${kebab(key)}`, value);
  }

  for (const [key, value] of Object.entries(shadow)) {
    push(`shadow-${kebab(key)}`, value);
  }

  push("ease", motion.ease);
  push("duration-fast", motion.durationFast);
  push("duration-base", motion.durationBase);
  push("duration-slow", motion.durationSlow);

  /* Tông mặc định của trang, trước khi section nào đặt tông của nó. */
  const base = tones.light;
  push("section-bg", base.bg);
  push("section-fg", base.fg);
  push("section-muted", base.muted);
  push("section-accent", base.accent);
  push("section-line", base.line);
  push("section-contrast", base.contrast);

  const toneBlocks = Object.entries(tones)
    .map(([name, tone]) =>
      [
        `[data-tone="${name}"] {`,
        `  --t-section-bg: ${tone.bg};`,
        `  --t-section-fg: ${tone.fg};`,
        `  --t-section-muted: ${tone.muted};`,
        `  --t-section-accent: ${tone.accent};`,
        `  --t-section-line: ${tone.line};`,
        `  --t-section-contrast: ${tone.contrast};`,
        `}`,
      ].join("\n"),
    )
    .join("\n");

  return `:root {\n${lines.join("\n")}\n}\n${toneBlocks}`;
}

function kebab(value: string): string {
  return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}
