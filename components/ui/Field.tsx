import type { ReactNode } from "react";

/** Nhãn của một ô nhập — một câu hỏi, bậc `body` của hệ chữ. */
export function FieldLabel({
  htmlFor,
  as: Tag = "label",
  children,
}: {
  htmlFor?: string;
  as?: "label" | "legend";
  children: ReactNode;
}) {
  /* Câu hỏi là một câu hoàn chỉnh, có khi xuống hai dòng — chữ thường, không
     giãn chữ, `text-pretty` để không mồ côi một chữ ở dòng cuối. */
  const className = "type-body text-tone-fg text-pretty";
  return Tag === "legend" ? (
    <legend className={`${className} pb-tight`}>{children}</legend>
  ) : (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}

/** Một ô nhập: nhãn trên, (ghi chú nhỏ), ô dưới. */
export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-tight">
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {hint ? <p className="type-note text-tone-muted">{hint}</p> : null}
      {children}
    </div>
  );
}

/** Một lựa chọn radio — cả dòng là vùng chạm, cao tối thiểu 2.75rem. */
export function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="type-body flex min-h-tap cursor-pointer items-center gap-stack">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 accent-tone-accent"
      />
      <span>{children}</span>
    </label>
  );
}
