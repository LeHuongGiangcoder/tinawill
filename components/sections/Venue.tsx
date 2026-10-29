import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { venue, venueScene } from "@/content/client";

/**
 * "Our wedding venue" — bản Canva khách vẽ, dựng lại thành cảnh ghép.
 *
 * Khách tách bản gốc thành năm lớp, mỗi lớp xuất nguyên khung 1080×1920 nền
 * trong suốt, nên web chỉ việc chồng chúng đúng thứ tự — không lớp nào phải
 * định vị riêng. Nền giấy ô liu đi qua `design.venue.background` để phủ kín
 * mọi khổ màn; bốn lớp còn lại nằm trong khung 9/16 (.stage-9x16) để trên
 * desktop cảnh thành một tấm áp phích dọc thay vì bị cắt còn một dải giữa.
 *
 * Chữ là chữ thật, không nằm trong tranh: cỡ và chỗ đặt lấy theo bản Canva
 * (phần trăm của khung 1080×1920), nhưng đi qua thang `stage-*` trong
 * content/theme.ts nên nó co giãn cùng tranh.
 *
 * Bộ asset gốc ~41MB nằm ngoài git; bản dùng thật là WebP 0.4MB trong
 * public/venue, dựng lại bằng `node scripts/venue-assets.mjs` (rồi
 * `node scripts/venue-arms.mjs` để dựng hai cánh tay từ hands.png).
 *
 * Section `flush`: cảnh tự quản chiều dọc — khung 9/16 phải chạm đúng hai mép
 * trên dưới của section, nếu không khoảng đệm `py-section` để lộ ra một dải
 * giấy trơn nơi đường cắt của nhánh ca cao và hai ống tay áo.
 */

const BASE = "/venue";

/** Khung gốc của bản Canva — mọi con số phần trăm bên dưới quy về đây. */
const FRAME = { w: 1080, h: 1920 };

/**
 * Ba lớp nằm DƯỚI chữ, từ dưới lên. Đúng thứ tự xếp lớp trong bản Canva:
 * bàn trước, rồi dây leo hoa, rồi nhành ca cao ở góc phải trên.
 */
const BEHIND = ["table", "vines", "fruit-branch"] as const;

/* Toạ độ đọc từ bản Canva, đổi sang phần trăm của khung.
   Tiêu đề: tâm khối chữ ở y 443.9 — trên nền xanh, phía trên mặt bàn.
   Cột thông tin: cả cụm chữ + nút chạy từ y 852.7 (mép trên dòng "Tapestry…")
   xuống 1313.5 (mép dưới viên thuốc), nên neo theo TÂM cụm — 1083.1.

   Neo theo tâm chứ không theo mép trên là có chủ ý: chữ web không cao đúng
   bằng chữ Canva (font khác, còn phải giữ cỡ tối thiểu đọc được trên máy
   hẹp), nên cụm sẽ cao hơn hoặc thấp hơn bản vẽ vài pixel. Neo mép trên thì
   sai số dồn hết xuống dưới và nút trôi khỏi mặt bàn; neo tâm thì nó chia đều
   hai đầu và cụm vẫn nằm giữa khăn trải. */
/**
 * Hai cánh tay: kích thước ảnh (px) và chỗ đặt trong khung — số in ra từ
 * `node scripts/venue-arms.mjs`, chạy lại script thì chép số mới vào đây.
 */
const ARMS = [
  {
    side: "left",
    px: { w: 788, h: 520 },
    at: { left: "-23.79%", top: "64.96%", width: "65.67%", height: "24.38%" },
  },
  {
    side: "right",
    px: { w: 728, h: 519 },
    at: { left: "56.63%", top: "68.24%", width: "60.67%", height: "24.33%" },
  },
] as const;

const TITLE_Y = `${((443.9 / FRAME.h) * 100).toFixed(2)}%`;
const COLUMN_Y = `${((1083.1 / FRAME.h) * 100).toFixed(2)}%`;

export function Venue() {
  return (
    <SectionWrapper section="venue" width="bleed" flush labelledBy="venue-title">
      <div className="stage-9x16">
        {BEHIND.map((name, i) => (
          <Image
            key={name}
            src={`${BASE}/${name}.webp`}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 48rem) 100vw, 30rem"
            /* Lớp tranh đã đúng cỡ hiển thị: để Next nén lại chỉ thêm một
               vòng encode mà không bớt được byte nào. */
            unoptimized
            className="pointer-events-none select-none object-cover"
            style={{ zIndex: (i + 1) * 10 }}
          />
        ))}

        {/* <h2> trần chứ không dùng <Heading>: Heading luôn kèm sẵn
            `font-display text-h2`, mà ở đây cần font viết tay và bậc chữ của
            cảnh — hai cặp class cùng thuộc tính chồng nhau thì thắng thua phụ
            thuộc thứ tự sinh CSS, không phải thứ tự viết. */}
        <h2
          id="venue-title"
          data-reveal
          className="absolute left-1/2 z-40 w-[88%] -translate-x-1/2 -translate-y-1/2 text-center font-script text-stage-title text-tone-fg"
          style={{ top: TITLE_Y }}
        >
          {venueScene.title}
        </h2>

        {/*
          Khối này nằm trên mặt khăn trải bàn màu kem — một mảng sáng giữa
          section tông tối. `data-tone="light"` lật bảng màu cho cả cụm, nên
          chữ và nút tự lấy màu của nền sáng mà không phải truyền prop hay
          viết màu cứng ở đây.
        */}
        <div
          data-tone="light"
          className="absolute left-1/2 z-40 flex w-[62%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-tight text-center"
          style={{ top: COLUMN_Y }}
        >
          <p data-reveal className="font-display text-stage-lead italic text-tone-fg">
            {venue.hall}
          </p>

          <p data-reveal data-reveal-delay="90" className="font-display text-stage-heading text-tone-fg">
            {venue.name}
          </p>

          <p data-reveal data-reveal-delay="180" className="font-display text-stage-caption italic text-tone-muted">
            {venueScene.cityLine}
          </p>

          {/*
            Nút này là mẫu gốc của cả hệ nút (`.btn` trong globals.css): chữ
            thường, không giãn chữ — bản Canva viết "Check map" thường vì chữ
            hoa giãn cách làm nhãn dài thêm một phần ba và nút phình tới vành
            ly vẽ sẵn. Màu xanh rừng chữ kem đến từ tông `light` của khăn trải
            bàn bao quanh, không phải từ chỗ gọi.

            Bề rộng để nút tự ôm lấy chữ: viên thuốc vẽ sẵn rộng 38.7% khung,
            nhưng nhãn dài ngắn tuỳ chữ nên ép theo % sẽ có ngày tràn.

            Chỉ cỡ chữ đi theo cảnh (`text-stage-action`, co theo bề rộng
            tranh) thay vì bậc `action` chung: ở 15px nút rộng thêm ~10px và
            ly bên trái che mất chữ đầu trên điện thoại.
          */}
          <ButtonLink
            data-reveal
            data-reveal-delay="270"
            href={venue.mapUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-stack text-stage-action"
          >
            {venueScene.mapLabel}
          </ButtonLink>
        </div>

        {/*
          Hai bàn tay cụng ly nằm TRÊN cả chữ lẫn nút, đúng như bản Canva —
          ly bên trái cắt qua mép dưới của nút. Không bắt chuột, nếu không nó
          nuốt mất cú chạm vào nút ngay dưới nó.
        */}
        {/*
          Hai cánh tay cụng ly, mỗi cánh một lớp để Motion.tsx cho chúng vươn
          vào nhau khi section cuộn tới (`data-clink`). Nằm TRÊN cả chữ lẫn
          nút, đúng như bản Canva — ly bên trái cắt qua mép dưới của nút. Không
          bắt chuột, nếu không nó nuốt mất cú chạm vào nút ngay dưới nó.

          Cánh tay vẽ TRỌN, dài quá mép khung (`node scripts/venue-arms.mjs`),
          nên bọc trong một lớp `overflow-hidden` ăn theo khung 9/16: tay đi
          vào bao nhiêu thì phần tay phía sau trượt ra bấy nhiêu, ống tay áo
          không bao giờ lộ đầu cụt. Mỗi cánh nằm trong một lớp `inset-0` nguyên
          khung để dịch theo phần trăm của khung, còn vị trí của cánh trong lớp
          ấy là phần trăm đo từ bản vẽ — in ra bởi chính script cắt ảnh.
        */}
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
          {ARMS.map((arm) => (
            <div key={arm.side} data-clink={arm.side} className="absolute inset-0">
              <Image
                src={`${BASE}/arm-${arm.side}.webp`}
                alt=""
                aria-hidden
                width={arm.px.w}
                height={arm.px.h}
                unoptimized
                className="absolute max-w-none select-none"
                style={arm.at}
              />
            </div>
          ))}
        </div>

        {/* Tranh là trang trí nên aria-hidden hết; câu này tả cảnh cho người
            dùng trình đọc màn hình. */}
        <p className="sr-only">{venueScene.sceneLabel}</p>
      </div>
    </SectionWrapper>
  );
}
