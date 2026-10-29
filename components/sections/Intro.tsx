"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { useExperience } from "@/components/experience/ExperienceProvider";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { TropicalCanopy } from "@/components/ui/TropicalCanopy";
import { design, intro } from "@/content/client";

/**
 * Màn mở thiệp: một tấm thiệp bầu dục giữa lùm cây nhiệt đới.
 *
 * Nền là <TropicalCanopy> — bốn tầng lá, hoa và quả xếp theo chiều sâu. Bấm
 * "Open invitation" thì từng tầng rẽ ra hai bên, tầng gần ống kính nhất đi
 * trước, và hero lộ dần ra phía sau.
 *
 * Tấm thiệp mờ đi ngay trong nhịp đầu để không che mất cảnh đang mở, còn cả
 * màn chỉ tháo khỏi DOM sau khi lá đã ra hẳn ngoài khung.
 *
 * Trang vẫn khoá cuộn cho tới khi thiệp mở (xem ExperienceProvider).
 */

/** Khớp với `duration` của cú rẽ trong TropicalCanopy, cộng một nhịp thở. */
const OPEN_MS = 2500;

export function Intro() {
  const { opened, open } = useExperience();
  const [gone, setGone] = useState(false);

  // Chờ lá ra hẳn khỏi khung rồi mới tháo khỏi DOM, không giật một nhịp.
  useEffect(() => {
    if (!opened) return;
    const timer = window.setTimeout(() => setGone(true), OPEN_MS);
    return () => window.clearTimeout(timer);
  }, [opened]);

  if (gone) return null;

  return (
    <div
      data-tone={design.intro.tone}
      role="dialog"
      aria-modal="true"
      aria-label={intro.label}
      className={[
        "fixed inset-0 z-40 flex items-center justify-center",
        opened ? "pointer-events-none" : "",
      ].join(" ")}
    >
      {/*
        Nền rừng sâu phía sau tán lá. Hoạ tiết khách gửi là hình cắt rời, giữa
        chúng luôn còn khe hở — không có lớp này thì khe hở lộ thẳng ra mặt
        nước của hero và màn mở thiệp trông như một tấm sticker dán lên ảnh.

        Nó tắt theo cú mở chứ không trôi cùng các tầng: một mảng màu phẳng mà
        trượt ngang thì để lại một đường cắt thẳng giữa khung.
      */}
      <div
        aria-hidden
        className={[
          "absolute inset-0 bg-forest-deep transition-opacity duration-1000 ease-glow",
          opened ? "opacity-0" : "opacity-100",
        ].join(" ")}
      />

      <TropicalCanopy />

      {/* Tấm thiệp nằm trên tầng hoa quả (z 30) nhưng dưới tầng sát ống kính
          (z 40), đúng như bản Canva: vài cánh hoa và quả gác lên mép bầu dục. */}
      <div
        className={[
          /* `short:` là máy nằm ngang — chiều cao chỉ còn ~375px, mà hình bầu
             dục cao hơn bề rộng của nó, nên không bóp lại thì thiệp bị cắt cả
             đầu lẫn chân. */
          /* `bg-beige` là mặt thiệp lúc file oval.webp chưa tải xong — trùng
             gần đúng màu giấy trong ảnh. Thiếu nó thì trong mấy giây đầu trên
             4G, chữ mực nâu nằm thẳng trên nền rừng tối và không ai đọc được.
             `rounded-full` trên một khối chữ nhật cho ra đúng hình bầu dục:
             trình duyệt co bán kính quá khổ theo tỉ lệ hai cạnh. */
          "relative z-[35] w-[78%] max-w-[20rem] short:max-w-[17rem] rounded-full bg-beige transition-opacity duration-700 ease-glow",
          opened ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <Image
          src="/tropical/oval.webp"
          unoptimized
          alt=""
          width={983}
          height={1100}
          priority
          sizes="80vw"
          className="h-auto w-full"
        />

        {/* Chữ nằm trong lòng hình bầu dục — lề ngang rộng hơn lề dọc vì bề
            ngang của một hình bầu dục hụt đi nhanh hơn khi ra sát mép. */}
        <div className="absolute inset-y-[16%] inset-x-[18%] flex flex-col items-center justify-center gap-stack text-center">
          <p className="font-script text-h3 short:text-h4">{intro.note}</p>

          <Divider diamond />

          <Button onClick={open}>{intro.cta}</Button>
        </div>
      </div>
    </div>
  );
}
