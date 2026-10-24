import Image from "next/image";

import type { DecorPlacement } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Một hoạ tiết rời của khách, đặt lên nền section.
 *
 * Luôn `aria-hidden` và không bắt chuột — chúng không mang nghĩa gì, chỉ để
 * nhìn. Vị trí và bề rộng viết bằng utility của Tailwind trong `at` (ví dụ
 * `"top-[6%] -left-[4%] w-[28%]"`), nên đặt lại hoạ tiết là sửa một chuỗi
 * trong content/client.ts chứ không phải sửa component.
 *
 * `opacity` mặc định là 1 và PHẢI giữ nguyên trừ khi người dùng yêu cầu hạ.
 * Xem "Ba luật thiết kế" trong CLAUDE.md: hoạ tiết mờ chìm vào nền là lỗi
 * hay gặp nhất — muốn dịu hơn thì xuất file màu nhạt hơn, đừng hạ opacity.
 */
export function Decor({ name, at, rotate = 0, opacity = 1, sway = false, parallax, hideOnMobile }: DecorPlacement) {
  const art = element(name);
  if (!art) return null;

  return (
    <span
      aria-hidden
      data-parallax={parallax || undefined}
      className={[
        "pointer-events-none absolute -z-10 select-none",
        hideOnMobile ? "hidden md:block" : "",
        sway ? "animate-sway" : "",
        at,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        opacity,
        // Khi đang lắc lư thì keyframes giữ `transform`, nên góc nghiêng
        // tĩnh phải nhường chỗ cho nó.
        transform: sway || !rotate ? undefined : `rotate(${rotate}deg)`,
      }}
    >
      <Image
        src={art.src}
        alt=""
        width={art.width ?? 600}
        height={art.height ?? 600}
        sizes="(max-width: 48rem) 40vw, 20rem"
        className="h-auto w-full"
      />
    </span>
  );
}
