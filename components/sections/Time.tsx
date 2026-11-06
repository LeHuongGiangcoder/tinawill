import Image from "next/image";
import type { CSSProperties } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { WeekStrip } from "@/components/ui/WeekStrip";
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
 * Chữ là chữ thật: chỗ đặt lấy theo bản Canva (phần trăm của khung
 * 1080×1920), còn cỡ chữ đi theo hệ chữ chung (`type-*`) như mọi trang khác.
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
   có chủ ý. Chữ đi theo hệ chữ chung chứ không co theo tranh, nên trên điện
   thoại đoạn giới thiệu dài ra nhiều dòng hơn hẳn bốn dòng như
   bản vẽ. Đặt từng dòng theo toạ độ thì tiêu đề và đoạn chữ chồng lên nhau;
   một cột thì nhịp giãn ra hai đầu và không dòng nào đè dòng nào.

   Tâm neo ở 650 chứ không phải 682 (tâm đúng của bản vẽ): cột chữ trên điện
   thoại cao hơn bản vẽ nên phần dôi ra chia đều hai đầu, kéo viên thuốc đè
   lên đầu hai chiếc ghế. Nhích lên 32px khung thì nút dừng đúng ở mép ghế
   (55.5% khung) trên máy hẹp, còn trên desktop — nơi đoạn chữ chỉ còn bốn
   dòng — cụm vẫn rơi đúng khoảng trống bản vẽ dành cho nó. */
const TEXT_Y = (650 / FRAME.h) * 100;

/** Cao của tranh gốc tính bằng cqw (16/9 bề rộng khung) — xem .stage-tall. */
const ART_CQW = (16 / 9) * 100;

/** Phần trăm chiều cao tranh gốc → cqw, để lá giữ cỡ khi khung cao thêm. */
const cq = (pct: number) => `${((pct * ART_CQW) / 100).toFixed(2)}cqw`;

/**
 * Sáu tán lá, mỗi tán một lớp để gió thổi riêng.
 *
 * Năm tán đầu là ảnh VẼ TRỌN khách gửi (new1..5.png, dựng bằng
 * `node scripts/time-fronds.mjs`): đặt đúng chỗ các bản cắt cũ từng đứng, phần
 * thừa nằm ngoài khung và bị `.stage-9x16` clip. Nhờ vậy tán đung đưa không
 * lộ mép cắt. `at` là phần trăm của khung 1200×2133. Tán `leaves-bottom` vẫn
 * là bản cắt cũ từ `scripts/time-foliage.mjs`.
 *
 * Ba con số còn lại là phần đặt tay, và chúng đi cùng `origin`:
 *
 *   origin  tâm quay, đo trong chính ảnh tán — gốc cuống / giữa cây, nơi tán
 *           bám vào khung; cuống đứng yên, chỉ đầu lá động
 *   deg     biên độ; tán càng lớn càng nhỏ biên độ, vì đầu lá ở xa gốc quay
 *           nên cùng một góc mà tán lớn quét đi xa hơn nhiều
 *   dur     nhịp đi–về; lệch nhau vài trăm ms là cả cụm hết thổi đều như máy
 *
 * Cả sáu đều là số lẻ và không chia hết cho nhau: hai tán cùng nhịp sẽ gặp
 * lại nhau sau mỗi vòng và mắt bắt ngay ra nhịp lặp.
 */
/** Hai ghế + mèo nhích lên (cqw) cho gần nút hơn; tàu cọ bên phải bám theo. */
const LOUNGER_LIFT = 5;

const FRONDS = [
  {
    name: "branch-top",
    anchor: "top",
    /* Phóng 1,2 lần quanh tâm cây (37% 44%), nhích lên một chút để đầu lá chỉ
       liếm qua chữ "S" chứ không nuốt cả "Sa" — vẫn dính góc trái trên. */
    at: { left: "-22.50%", top: "-15.70%", width: "64.90%", height: "47.15%" },
    /* Nằm TRÊN chữ như bản Canva: lá dưới cùng liếm qua chữ "S" của "Save". */
    layer: "z-40",
    origin: "37% 44%",
    deg: "4.2deg",
    dur: "9.2s",
    delay: "-1.4s",
  },
  {
    /* Neo đáy cùng `leaves-left`: hai tán chạm nhau trong bản vẽ, neo khác mép
       thì khung cao thêm kéo chúng rời nhau. */
    name: "frond-left",
    anchor: "bottom",
    at: { left: "-6.00%", top: "38.82%", width: "25.08%", height: "9.42%" },
    origin: "23% 87%",
    deg: "6deg",
    dur: "6.7s",
    delay: "-0.6s",
  },
  {
    name: "leaves-left",
    anchor: "bottom",
    at: { left: "-25.33%", top: "45.57%", width: "66.58%", height: "56.17%" },
    origin: "40% 85%",
    deg: "2.8deg",
    dur: "10.5s",
    delay: "-3.1s",
  },
  {
    name: "palm-right-top",
    anchor: "bottom",
    at: { left: "78.00%", top: "62.03%", width: "27.83%", height: "7.83%" },
    origin: "96% 67%",
    lift: LOUNGER_LIFT,
    deg: "6.5deg",
    dur: "7.3s",
    delay: "-2.2s",
  },
  {
    name: "palm-right-bottom",
    anchor: "bottom",
    at: { left: "78.25%", top: "71.59%", width: "24.58%", height: "6.24%" },
    origin: "98% 66%",
    lift: LOUNGER_LIFT,
    deg: "6deg",
    dur: "8.1s",
    delay: "-0.9s",
  },
  {
    name: "leaves-bottom",
    anchor: "bottom",
    at: { left: "48.50%", top: "78.90%", width: "51.50%", height: "21.10%" },
    /* Bản cắt cũ, chưa có ảnh vẽ trọn: mép phải và mép dưới của nó CHÍNH LÀ
       mép khung, nên xoay quanh đáy giữa sẽ nhấc một góc lên và hở một vệt
       nền. Gốc quay đặt đúng góc khung, cả tán đẩy ra ngoài khung một đoạn
       (`push`, cqw) bằng độ hở lớn nhất của cú lắc, và biên độ nhỏ lại cho
       vừa đoạn đó — phần đẩy ra bị `.stage-9x16` clip nên không ai thấy. */
    origin: "100% 100%",
    push: "2.5cqw 4cqw",
    deg: "1.8deg",
    dur: "11.4s",
    delay: "-4.3s",
  },
];

/** Chỗ đặt + biến gió của một tán — `.frond` trong app/globals.css đọc chỗ này. */
function frondStyle(frond: (typeof FRONDS)[number]): CSSProperties {
  const top = parseFloat(frond.at.top);
  const height = parseFloat(frond.at.height);
  /* Khung cao hơn tranh nên lá không được định vị bằng % chiều cao khung:
     `top`/`bottom` tính theo cqw từ mép lá thuộc về, `mid` đi theo khối chữ. */
  const vertical: CSSProperties =
    frond.anchor === "top"
      ? { top: cq(top) }
      : frond.anchor === "bottom"
        ? {
            bottom: `calc(${cq(100 - top - height)} + ${"lift" in frond ? frond.lift : 0}cqw)`,
          }
        : { top: `calc(${cq(top)} + (100% - var(--art-h)) / 2)` };
  return {
    left: frond.at.left,
    width: frond.at.width,
    height: cq(height),
    ...vertical,
    transformOrigin: frond.origin,
    ...("push" in frond ? { translate: frond.push } : {}),
    "--frond-deg": frond.deg,
    "--frond-dur": frond.dur,
    "--frond-delay": frond.delay,
  } as CSSProperties;
}

export function Time() {
  return (
    <SectionWrapper section="time" width="bleed" flush labelledBy="time-title">
      <div className="stage-9x16 stage-tall stage-roomy">
        {/* Hai ghế tắm nắng: lớp duy nhất nằm dưới chữ. Ghế trái để trống —
            bé mèo của CatJourney chạy từ Hero xuống ngồi vào đó, toạ độ đáp
            đo theo khung này (`data-cat-seat`). */}
        <div
          data-cat-seat
          className="stage-art stage-art-bottom z-10"
          style={{ bottom: `${LOUNGER_LIFT}cqw` }}
        >
          <Image
            src={`${BASE}/loungers-empty.webp`}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 48rem) 100vw, 30rem"
            /* Lớp tranh đã đúng cỡ hiển thị — xem components/sections/Venue.tsx */
            unoptimized
            className="select-none object-fill"
          />
        </div>

        {/*
          <h2> trần chứ không dùng <Heading>: Heading luôn kèm sẵn
          `font-display text-h2`, mà ở đây cần font viết tay và bậc chữ của
          cảnh — hai cặp class cùng thuộc tính chồng nhau thì thắng thua phụ
          thuộc thứ tự sinh CSS, không phải thứ tự viết.
        */}
        <div
          className="absolute left-1/2 z-30 flex w-[84%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-stack text-center"
          style={{ top: `calc(${cq(TEXT_Y)} + (100% - var(--art-h)) / 2)` }}
        >
          <h2
            id="time-title"
            data-reveal
            className="type-title text-tone-title"
          >
            {timeScene.title}
          </h2>

          <div className="flex w-full flex-col items-center gap-block">
            {/* Một tuần quanh ngày cưới, ngày cưới khoanh trái tim. Dải chỉ để
                nhìn; trình đọc màn hình đọc câu ngày đầy đủ ngay bên dưới. */}
            <div
              data-reveal
              data-reveal-delay="180"
              aria-hidden
              className="w-full"
            >
              <WeekStrip iso={ceremony.startISO} />
            </div>
            <p className="sr-only">
              {ceremony.weekday}, {ceremony.dateShort}
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
        {FRONDS.map((frond) => (
          <div
            key={frond.name}
            aria-hidden
            className={`pointer-events-none absolute ${"layer" in frond ? frond.layer : "z-20"} frond`}
            style={frondStyle(frond)}
          >
            <Image
              src={`${BASE}/foliage-${frond.name}.webp`}
              alt=""
              fill
              sizes="(max-width: 48rem) 100vw, 30rem"
              /* Lớp tranh đã đúng cỡ hiển thị — xem components/sections/Venue.tsx */
              unoptimized
              className="select-none object-fill"
            />
          </div>
        ))}

        {/* Tranh là trang trí nên aria-hidden hết; câu này tả cảnh cho người
            dùng trình đọc màn hình. */}
        <p className="sr-only">{timeScene.sceneLabel}</p>
      </div>
    </SectionWrapper>
  );
}
