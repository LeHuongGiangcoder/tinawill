"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TabItem = {
  /** Khoá ổn định, dùng dựng id cho cặp tab ↔ panel. */
  id: string;
  /** Nội dung của chính cái nút — ảnh, chữ, gì cũng được. */
  tab: ReactNode;
  panel: ReactNode;
};

/**
 * Bộ thẻ: một hàng nút, bấm nút nào hiện phần nội dung của nút ấy.
 *
 * Đây là component CÓ state nên nó là client component — một trong hai chỗ
 * duy nhất của site (chỗ kia là ExperienceProvider). Section bọc nó vẫn là
 * server component: nó chỉ truyền xuống `tab` và `panel` đã dựng sẵn.
 *
 * Bàn phím đi đúng chuẩn WAI-ARIA Tabs: Tab vào đúng một nút đang chọn
 * (roving tabindex), rồi mũi tên trái/phải chạy vòng giữa các nút, Home/End
 * về đầu và cuối. `aria-selected` vừa là trạng thái cho trình đọc màn hình
 * vừa là cái móc cho CSS, nên hình dáng nút không cần class điều kiện.
 *
 * Phần nội dung KHÔNG nên chứa `data-reveal`: GSAP dựng trigger một lần lúc
 * trang tải, mà panel đang ẩn thì không có kích thước để tính mốc cuộn — khối
 * nào nằm trong đó sẽ kẹt ở opacity 0 khi khách bấm sang. Cho cả bộ thẻ vào
 * một <Reveal> ở ngoài là đủ.
 */
export function TabSet({
  label,
  items,
  className = "",
}: {
  /** Nhãn của hàng nút cho trình đọc màn hình. */
  label: string;
  items: TabItem[];
  className?: string;
}) {
  const base = useId();
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = items.length - 1;
    const next =
      event.key === "ArrowRight"
        ? active === last
          ? 0
          : active + 1
        : event.key === "ArrowLeft"
          ? active === 0
            ? last
            : active - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;

    if (next === null) return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="flex gap-stack">
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${item.id}`}
            aria-controls={`${base}-panel-${item.id}`}
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            /* basis-0 + flex-1: các nút chia đều bề ngang dù tem rộng hẹp khác nhau */
            className="tab flex-1 basis-0"
          >
            {item.tab}
          </button>
        ))}
      </div>

      {items.map((item, i) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-panel-${item.id}`}
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={active !== i}
          className="mt-block"
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
