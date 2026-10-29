import type { ReactNode } from "react";

/**
 * Khối gập: một hàng nhãn bấm được, mở ra phần chữ bên dưới.
 *
 * Dùng `<details>`/`<summary>` của chính trình duyệt chứ không dựng state
 * React, vì ba lý do: nó mở được cả khi JS chưa tải xong, trình đọc màn hình
 * đọc đúng trạng thái đóng/mở mà không cần `aria-expanded` viết tay, và
 * Ctrl+F của trình duyệt tìm thấy chữ nằm trong khối đang đóng.
 *
 * Section chỉ truyền nhãn và nội dung — hình dáng nằm ở `.disclosure` trong
 * app/globals.css nên khối gập ở section nào cũng cùng một nhịp.
 */
export function Disclosure({
  label,
  name,
  defaultOpen = false,
  className = "",
  children,
}: {
  label: string;
  /** Mở sẵn khi trang vừa tải — dành cho mục quan trọng nhất của nhóm. */
  defaultOpen?: boolean;
  /**
   * Các khối cùng `name` thành một nhóm: mở khối này thì khối đang mở tự gập
   * lại — trình duyệt tự làm, không cần state.
   */
  name?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <details className={`disclosure ${className}`} name={name} open={defaultOpen}>
      <summary className="disclosure-summary">
        <span className="font-display text-h4">{label}</span>
        {/* Dấu cộng xoay thành dấu trừ khi mở — vẽ bằng hai gạch nên nó lấy
            đúng màu chữ của tông, không cần file icon nào. */}
        <span aria-hidden className="disclosure-mark" />
      </summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
