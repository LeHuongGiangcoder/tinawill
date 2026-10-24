/**
 * Gạch ngang mảnh, mờ dần hai đầu. Màu theo tông của section.
 * `diamond` thêm một viên thoi ở giữa cho các section trang trọng hơn.
 */
export function Divider({
  diamond = false,
  className = "",
}: {
  diamond?: boolean;
  className?: string;
}) {
  if (!diamond) {
    return (
      <hr
        aria-hidden
        className={`h-px w-full max-w-[12rem] border-0 bg-gradient-to-r from-transparent via-tone-line to-transparent ${className}`}
      />
    );
  }

  return (
    <span aria-hidden className={`flex w-full max-w-[12rem] items-center gap-tight ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-tone-line" />
      <span className="size-1.5 rotate-45 bg-tone-accent" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-tone-line" />
    </span>
  );
}
