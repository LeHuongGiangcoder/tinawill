import Image from "next/image";
import type { ReactNode } from "react";

import { Decor } from "./Decor";
import { design, type SectionId } from "@/content/client";
import { background as resolveBackground, divider as resolveDivider, texture as resolveTexture } from "@/lib/assets";

type SectionWrapperProps = {
  /** Khoá tra trong `design` của content/client.ts — quyết định tông, nền, hoạ tiết. */
  section: SectionId;
  /** Dùng khi section tự quản chiều dọc của nó (ví dụ hero cao full màn hình). */
  flush?: boolean;
  /** Bề rộng nội dung: "site" cho layout thường, "prose" cho khối chữ dài. */
  width?: "site" | "prose" | "bleed";
  labelledBy?: string;
  /** Chỉ cho layout (grid, min-height…), tuyệt đối không dùng để đặt màu hay size chữ. */
  className?: string;
  children: ReactNode;
};

/**
 * Vỏ chung của mọi section. Nó giữ bốn thứ để section con không phải nhắc lại:
 * nhịp dọc, lề ngang, bảng màu theo tông, và lớp nền của khách.
 *
 * Mặt nhìn của section KHÔNG nằm trong file section — nó nằm ở `design` trong
 * content/client.ts. Nhờ vậy đổi một section từ nền kem sang nền xanh có vân
 * giấy và hai nhành hoa ở góc là sửa nội dung, không phải sửa code.
 *
 * Thứ tự xếp lớp, từ dưới lên: ảnh nền → lớp phủ → vân giấy → hoạ tiết →
 * nội dung. Dải ngăn nằm trên cùng vì nó cưỡi lên đường nối hai section.
 */
export function SectionWrapper({
  section,
  flush = false,
  width = "site",
  labelledBy,
  className = "",
  children,
}: SectionWrapperProps) {
  const spec = design[section];
  const background = resolveBackground(spec.background);
  const texture = resolveTexture(spec.texture);
  const divider = resolveDivider(spec.divider);

  const container =
    width === "prose" ? "container-prose" : width === "bleed" ? "" : "container-site";

  return (
    <section
      id={spec.anchor}
      data-tone={spec.tone}
      aria-labelledby={labelledBy}
      className={[
        "relative isolate overflow-x-clip bg-tone-bg text-tone-fg",
        flush ? "" : "py-section",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {background ? (
        <div aria-hidden className="absolute inset-0 -z-20">
          <Image src={background.src} alt="" fill sizes="100vw" className="object-cover" />
          {/* Lớp phủ bằng chính màu nền của tông, để chữ đọc được dù ảnh sáng hay tối */}
          <div className="absolute inset-0 bg-tone-bg" style={{ opacity: spec.overlay ?? 0.7 }} />
        </div>
      ) : null}

      {texture ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-repeat"
          style={{
            backgroundImage: `url(${texture.src})`,
            // Ô lặp cố định theo px: vân giấy phải giữ nguyên kích thước hạt
            // ở mọi bề rộng màn hình, nếu co giãn theo màn thì hết ra giấy.
            backgroundSize: "340px",
          }}
        />
      ) : null}

      {spec.decor?.map((item, i) => <Decor key={`${item.name}-${i}`} {...item} />)}

      {divider ? (
        <div
          aria-hidden
          /* Cưỡi lên đường nối: nửa trên nằm đè sang section phía trước */
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[clamp(1.5rem,6vw,3rem)] -translate-y-1/2 bg-tone-fg"
          style={{
            maskImage: `url(${divider.src})`,
            WebkitMaskImage: `url(${divider.src})`,
            maskRepeat: "repeat-x",
            WebkitMaskRepeat: "repeat-x",
            maskSize: "auto 100%",
            WebkitMaskSize: "auto 100%",
            maskPosition: "center top",
            WebkitMaskPosition: "center top",
          }}
        />
      ) : null}

      {container ? <div className={container}>{children}</div> : children}
    </section>
  );
}
