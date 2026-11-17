"use client";

import { useEffect, useRef, useState } from "react";

import { createDance, DANCE_POSTER, type Dance, type DanceLook } from "@/lib/dance";

export type DanceSwatch = { name: string; hex: string; look?: DanceLook };

/**
 * Cặp đôi khiêu vũ + bảng màu của trang Dresscode.
 *
 * Váy và vest đổi lần lượt qua từng màu của bảng; ô màu đang mặc trên người
 * cặp đôi phóng to lên một nhịp, nên khách nhìn là biết "màu này đây". Hai
 * thứ nằm chung một component vì chúng phải biết nhau.
 *
 * Canvas WebGL ở lib/dance.ts. Component chỉ lo vòng đời:
 *   - chỉ tải năm ảnh khi section sắp cuộn tới (không tốn băng thông lúc mở thiệp);
 *   - dừng vẽ khi ra khỏi màn, quay lại thì nhảy tiếp từ chỗ đã dừng;
 *   - `prefers-reduced-motion` hoặc máy không có WebGL → giữ ảnh tĩnh đỏ ruby.
 *
 * Ảnh tĩnh nằm dưới canvas suốt, cùng khung với sân khấu của canvas (tranh
 * 900×985 giữa sân 980×1060 — `.dance-stage` trong globals.css), nên lúc
 * canvas thế chỗ không bị giật.
 */
export function DressDance({ swatches }: { swatches: DanceSwatch[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState<DanceLook | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let dance: Dance | null = null;
    let disposed = false;
    let loading = false;
    let visible = false;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let shown: DanceLook | null = null;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(stage.clientWidth * dpr);
      canvas.height = Math.round(stage.clientHeight * dpr);
    };

    const tick = (now: number) => {
      if (!dance) return;
      elapsed += last ? Math.min(now - last, 100) / 1000 : 0;
      last = now;
      const look = dance.render(elapsed);
      if (look !== shown) {
        shown = look;
        setActive(look);
      }
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      if (!dance || frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const pause = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const start = async () => {
      loading = true;
      try {
        fit();
        const created = await createDance(canvas);
        if (disposed) return created.destroy();
        dance = created;
        setLive(true);
        if (visible) play();
      } catch {
        /* Không WebGL / ảnh lỗi: ảnh tĩnh vẫn nằm đó. */
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !loading) start();
        if (visible) play();
        else pause();
      },
      /* Tải trước khi tới nửa màn để lúc khách cuộn tới là nhảy luôn. */
      { rootMargin: "50% 0px" },
    );
    io.observe(stage);

    const ro = new ResizeObserver(() => {
      fit();
      if (dance && !frame) dance.render(elapsed);
    });
    ro.observe(stage);

    return () => {
      disposed = true;
      pause();
      io.disconnect();
      ro.disconnect();
      dance?.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-block">
      <div ref={stageRef} className="dance-stage" data-live={live || undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element -- poster phải
            trùng khung pixel với canvas; next/image bọc thêm lớp làm lệch. */}
        <img
          src={DANCE_POSTER}
          alt="Tina and Will dancing, their outfits changing through the dresscode colours"
          decoding="async"
          loading="lazy"
          className="dance-stage__poster"
        />
        <canvas ref={canvasRef} aria-hidden className="dance-stage__canvas" />
      </div>

      {swatches.length > 0 ? (
        /* Cả năm ô một hàng: trên điện thoại cột chỉ còn ~60px, nên hàng ô
           tràn ra lề của tờ giấy thêm một `gutter` mỗi bên để tên màu dài
           nhất ("Tangerine") và mã hex vẫn nằm gọn trong cột; chữ dùng bậc `type-fine`. */
        <ul className="-mx-gutter grid grid-cols-5 self-stretch">
          {swatches.map((swatch) => (
            <li
              key={swatch.hex}
              data-active={(swatch.look && swatch.look === active) || undefined}
              className="swatch-item flex min-w-0 flex-col items-center gap-tight text-center"
            >
              {/* Vệt sơn khách gửi, tô bằng mã màu của chính ô — hình dáng và
                  nét cọ nằm ở `.swatch` trong app/globals.css. */}
              <span aria-hidden className="swatch w-full" style={{ backgroundColor: swatch.hex }} />
              <span className="type-fine">{swatch.name}</span>
              {/* `tabular-nums` để các mã xếp thẳng cột thay vì so le. */}
              <span className="type-fine tabular-nums uppercase text-tone-muted">{swatch.hex}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
