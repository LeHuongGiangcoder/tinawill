import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, timeScene } from "@/content/client";
import { googleCalendarUrl } from "@/lib/calendar";

/**
 * "Save the Date" — bản Canva khách vẽ, dựng lại thành cảnh ghép.
 *
 * Cùng một cách dựng như cảnh Venue: khách tách bản gốc thành hai lớp, mỗi
 * lớp xuất nguyên khung 3375×6000 nền trong suốt, nên web chỉ việc chồng
 * chúng đúng thứ tự — không lớp nào phải định vị riêng. Giấy rượu vang đi qua
 * `design.time.background` để phủ kín mọi khổ màn; hai lớp tranh nằm trong
 * khung 9/16 (.stage-9x16) để trên desktop cảnh thành tấm thiệp dọc.
 *
 * Thứ tự xếp lớp đúng theo bản vẽ: ghế tắm nắng nằm DƯỚI chữ, lá cây nằm
 * TRÊN chữ — nhành lá góc trái trên liếm qua chữ "S" của "Save", và tàu cọ
 * bên trái cắt qua mép ghế.
 *
 * Chữ là chữ thật: cỡ và chỗ đặt lấy theo bản Canva (phần trăm của khung
 * 1080×1920) nhưng đi qua thang `stage-*` trong content/theme.ts nên nó co
 * giãn cùng tranh.
 *
 * Bản dùng thật là WebP 0.24MB trong public/time, dựng lại bằng
 * `node scripts/time-assets.mjs`.
 */

const BASE = "/time";

/** Khung gốc của bản Canva — mọi con số phần trăm bên dưới quy về đây. */
const FRAME = { w: 1080, h: 1920 };

/* Cụm chữ của bản Canva chạy từ y 312 (mép trên "Save the Date") xuống 1052
   (mép dưới viên thuốc), nên nó neo theo TÂM — 682/1920.

   Neo cả cụm bằng một cột chứ không đặt từng dòng theo đúng toạ độ Canva là
   có chủ ý. Thang `stage-*` có sàn tính bằng rem để chữ còn đọc được trên máy
   hẹp, nên trên điện thoại đoạn giới thiệu dài ra bảy dòng thay vì bốn như
   bản vẽ. Đặt từng dòng theo toạ độ thì tiêu đề và đoạn chữ chồng lên nhau;
   một cột thì nhịp giãn ra hai đầu và không dòng nào đè dòng nào.

   Tâm neo ở 650 chứ không phải 682 (tâm đúng của bản vẽ): cột chữ trên điện
   thoại cao hơn bản vẽ nên phần dôi ra chia đều hai đầu, kéo viên thuốc đè
   lên đầu hai chiếc ghế. Nhích lên 32px khung thì nút dừng đúng ở mép ghế
   (55.5% khung) trên máy hẹp, còn trên desktop — nơi đoạn chữ chỉ còn bốn
   dòng — cụm vẫn rơi đúng khoảng trống bản vẽ dành cho nó. */
const TEXT_Y = `${((650 / FRAME.h) * 100).toFixed(2)}%`;

export function Time() {
  return (
    <SectionWrapper section="time" width="bleed" labelledBy="time-title">
      <div className="stage-9x16">
        {/* Hai ghế tắm nắng: lớp duy nhất nằm dưới chữ. */}
        <Image
          src={`${BASE}/loungers.webp`}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 48rem) 100vw, 30rem"
          /* Lớp tranh đã đúng cỡ hiển thị — xem components/sections/Venue.tsx */
          unoptimized
          className="pointer-events-none z-10 select-none object-cover"
        />

        {/*
          <h2> trần chứ không dùng <Heading>: Heading luôn kèm sẵn
          `font-display text-h2`, mà ở đây cần font viết tay và bậc chữ của
          cảnh — hai cặp class cùng thuộc tính chồng nhau thì thắng thua phụ
          thuộc thứ tự sinh CSS, không phải thứ tự viết.
        */}
        <div
          className="absolute left-1/2 z-30 flex w-[84%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-stack text-center"
          style={{ top: TEXT_Y }}
        >
          <h2
            id="time-title"
            data-reveal
            className="font-script text-stage-title text-tone-fg"
          >
            {timeScene.title}
          </h2>

          <p
            data-reveal
            data-reveal-delay="90"
            className="w-[92%] font-display text-stage-lead text-tone-fg"
          >
            {timeScene.intro}
          </p>

          <div className="flex flex-col items-center gap-tight">
            <p data-reveal data-reveal-delay="180" className="font-display text-stage-heading text-tone-fg">
              {ceremony.dateShort}
            </p>

            <p
              data-reveal
              data-reveal-delay="240"
              className="font-display text-stage-caption italic text-tone-fg"
            >
              {ceremony.weekday} {ceremony.timeLabel}
            </p>

            {/* Viên thuốc vàng nghệ chữ rượu vang — cặp màu nút của tông
                `wine`, nên trùng mảng vàng vẽ sẵn trong bản Canva mà không cần
                biến thể riêng. Bề rộng để nút tự ôm lấy chữ: nhãn dài ngắn
                tuỳ chữ nên ép theo % sẽ có ngày tràn. */}
            <ButtonLink
              data-reveal
              data-reveal-delay="300"
              href={googleCalendarUrl()}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-stack text-stage-action"
            >
              {timeScene.calendarLabel}
            </ButtonLink>
          </div>
        </div>

        {/*
          Lá cây nằm TRÊN hai chiếc ghế, đúng như bản Canva — tàu cọ bên trái
          cắt qua mép ghế, lá lớn dưới cùng che chân ghế.

          Khác bản Canva một điểm: lớp này nằm DƯỚI chữ. Trong bản vẽ nhành lá
          góc trái trên phủ hẳn chữ "S" của "Save", và trên màn điện thoại —
          nơi chữ không co nhỏ được như trong Canva vì còn phải đọc được — nó
          nuốt luôn cả chữ thứ hai. Tiêu đề là dòng chữ chính của section nên
          nó được quyền nằm trên.

          Không bắt chuột, nếu không nó nuốt mất cú chạm vào nút phía dưới.
        */}
        <Image
          src={`${BASE}/foliage.webp`}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 48rem) 100vw, 30rem"
          unoptimized
          className="pointer-events-none z-20 select-none object-cover"
        />

        {/* Tranh là trang trí nên aria-hidden hết; câu này tả cảnh cho người
            dùng trình đọc màn hình. */}
        <p className="sr-only">{timeScene.sceneLabel}</p>
      </div>
    </SectionWrapper>
  );
}
