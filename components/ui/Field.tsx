import type { ReactNode } from "react";

/** Nhãn của một ô nhập — in hoa, nhỏ, cùng cỡ với eyebrow. */
export function FieldLabel({
  htmlFor,
  as: Tag = "label",
  children,
}: {
  htmlFor?: string;
  as?: "label" | "legend";
  children: ReactNode;
}) {
  const className = "font-body text-eyebrow font-medium uppercase text-tone-muted";
  return Tag === "legend" ? (
    <legend className={className}>{children}</legend>
  ) : (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}

/** Một ô nhập: nhãn trên, ô dưới. */
export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-tight">
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
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
    <label className="flex min-h-tap cursor-pointer items-center gap-stack text-small">
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
