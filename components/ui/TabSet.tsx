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
  listClassName = "grid grid-flow-col auto-cols-fr gap-stack",
  tabClassName = "",
  presentation = "swap",
  panelsClassName = "",
  overlay,
}: {
  /** Nhãn của hàng nút cho trình đọc màn hình. */
  label: string;
  items: TabItem[];
  className?: string;
  /**
   * Cách xếp hàng nút. Mặc định là một hàng ngang, các nút chia đều bề ngang.
   * Nhiều nút quá thì một hàng không đủ chỗ trên điện thoại — chỗ gọi truyền
   * lưới riêng vào, ví dụ `"grid grid-cols-3 sm:grid-cols-6 gap-stack"`.
   */
  listClassName?: string;
  /** Lớp thêm cho từng nút, ví dụ `tab-boxed` để nút chọn có khung viền. */
  tabClassName?: string;
  /**
   * Cách đổi thẻ.
   *
   *   swap   thẻ không chọn bị `hidden` — khối cao đúng bằng thẻ đang mở.
   *   slide  cả bộ nằm trên một dải ngang, đổi thẻ là dải trượt sang. Khối
   *          cao bằng thẻ DÀI NHẤT vì thẻ nào cũng nằm trong bố cục.
   */
  presentation?: "swap" | "slide";
  /** Lớp cho vùng chứa panel — chỗ gọi dùng để dựng khung bao quanh. */
  panelsClassName?: string;
  /** Phủ lên vùng panel, ví dụ hai cánh cửa sổ của trang Travel. */
  overlay?: ReactNode;
}) {
  const base = useId();
  const [active, setActive] = useState(0);
  const sliding = presentation === "slide";
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
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={listClassName}>
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
            className={`tab ${tabClassName}`}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className={`relative mt-block ${panelsClassName}`}>
        {/*
          Kiểu `slide`: cả bộ panel nằm cạnh nhau trên một dải rộng gấp N lần,
          đổi thẻ là dải trượt ngang. Dải rộng N×100% và mỗi panel rộng
          100/N% của dải — tức đúng 100% khung nhìn — nên dịch dải đi một
          phần N là sang gọn một panel.

          `inert` là bắt buộc chứ không phải tô điểm: panel không chọn vẫn
          nằm trong bố cục (chỉ bị cắt khuất), nên không có nó thì khách bấm
          Tab sẽ lạc vào cái link nằm ngoài màn hình và trình đọc màn hình
          đọc cả phần đang không xem.
        */}
        <div
          className={sliding ? "tab-track" : undefined}
          style={
            sliding
              ? {
                  width: `${items.length * 100}%`,
                  transform: `translateX(-${(active * 100) / items.length}%)`,
                }
              : undefined
          }
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              role="tabpanel"
              id={`${base}-panel-${item.id}`}
              aria-labelledby={`${base}-tab-${item.id}`}
              hidden={sliding ? undefined : active !== i}
              inert={sliding && active !== i}
              style={sliding ? { width: `${100 / items.length}%` } : undefined}
              className={sliding ? "shrink-0" : undefined}
            >
              {item.panel}
            </div>
          ))}
        </div>

        {overlay}
      </div>
    </div>
  );
}
