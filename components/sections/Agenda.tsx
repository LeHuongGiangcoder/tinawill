import Image from "next/image";

import { Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TabSet } from "@/components/ui/TabSet";
import { agenda, type AgendaStamp } from "@/content/client";

/**
 * Chương trình cả cuối tuần. Ba ngày nằm sau ba con tem: bấm con nào mở lịch
 * ngày ấy, nên section cao bằng một ngày thay vì bằng cả ba.
 *
 * Trong mỗi ngày là trục thời gian — giờ bên trái, một viên thoi trên trục
 * dọc, nội dung bên phải. Trục kẻ bằng border của phần tử giữa nên nó tự dài
 * đúng bằng hàng, không cần đo bằng JS.
 *
 * Cột giờ rộng cố định và chữ nhỏ hơn tiêu đề, vì nhãn "Daytime" dài hơn một
 * mốc giờ và không được đẩy cả hàng lệch đi.
 *
 * Bên trong panel KHÔNG dùng <Reveal>: panel đang ẩn không có kích thước nên
 * GSAP không dựng nổi mốc cuộn cho nó — xem components/ui/TabSet.tsx. Cả bộ
 * thẻ nằm trong một <Reveal> ở ngoài là đủ.
 */

/**
 * Ba con tem, cắt từ bản khách gửi bằng `node scripts/agenda-assets.mjs`,
 * rồi tách làm hai lớp — khung và icon — bằng `node scripts/agenda-icons.mjs`
 * để icon của tem đang chọn đung đưa được mà khung đứng yên.
 *
 * Kiểu `Record<AgendaStamp, …>` nên thêm một con tem mới vào content/client.ts
 * mà quên khai ở đây là build đỏ.
 */
const STAMPS: Record<AgendaStamp, { frame: string; icon: string }> = {
  cocktail: { frame: "/agenda/cocktail-frame.webp", icon: "/agenda/cocktail-icon.webp" },
  sun: { frame: "/agenda/sun-frame.webp", icon: "/agenda/sun-icon.webp" },
  monstera: { frame: "/agenda/monstera-frame.webp", icon: "/agenda/monstera-icon.webp" },
};

export function Agenda() {
  return (
    <SectionWrapper section="agenda" labelledBy="agenda-title">
      <SectionHead
        eyebrow={agenda.eyebrow}
        title={agenda.title}
        titleId="agenda-title"
        subtitle={agenda.subtitle}
        intro={agenda.intro}
      />

      <Reveal className="mx-auto max-w-prose">
        <TabSet
          label={agenda.daysLabel}
          items={agenda.days.map((day) => {
            const stamp = STAMPS[day.stamp];

            return {
              id: day.stamp,
              tab: (
                <>
                  {/* Ba con tem cao thấp khác nhau (ly martini thấp, mặt trời
                      cao), nên mỗi con nằm trong một khung cùng tỉ lệ và
                      `object-contain` — có vậy ba dòng chữ dưới tem mới thẳng
                      hàng thay vì so le theo chiều cao tranh. */}
                  <span className="tab-stamp relative block aspect-[6/7] w-full">
                    <Image
                      src={stamp.frame}
                      alt=""
                      fill
                      sizes="(max-width: 40rem) 30vw, 11rem"
                      className="object-contain"
                    />
                    {/* Icon cùng khổ với khung nên chồng lên là khớp; chỉ
                        lớp này đung đưa khi tem được chọn. */}
                    <Image
                      src={stamp.icon}
                      alt=""
                      fill
                      sizes="(max-width: 40rem) 30vw, 11rem"
                      className="tab-wiggle object-contain"
                    />
                  </span>
                  {/* Ngày rồi tên chủ đề, nằm dưới con tem đúng như bản mẫu */}
                  <span className="font-body text-small">{day.label}</span>
                  <span className="font-display text-h4">{day.title}</span>
                  <span aria-hidden className="tab-mark" />
                </>
              ),
              panel: (
                <ol className="flex flex-col">
                  {day.items.map((item, i) => (
                    <li
                      key={`${item.time}-${item.title}`}
                      className="grid grid-cols-[4.5rem_1.5rem_1fr] items-start gap-stack sm:grid-cols-[6rem_1.5rem_1fr]"
                    >
                      <p className="pt-1 text-right font-display text-h4 text-tone-accent">
                        {item.time}
                      </p>

                      {/* Trục dọc: hàng cuối không kẻ tiếp để đường không thừa ra */}
                      <div
                        aria-hidden
                        className={`flex h-full flex-col items-center ${
                          i === day.items.length - 1 ? "" : "pb-stack"
                        }`}
                      >
                        <span className="mt-2 size-2 shrink-0 rotate-45 bg-tone-accent" />
                        {i === day.items.length - 1 ? null : (
                          <span className="mt-tight w-px flex-1 bg-tone-line" />
                        )}
                      </div>

                      <div className="flex flex-col gap-tight pb-stack last:pb-0">
                        <Heading level="h4">{item.title}</Heading>
                        {item.note ? (
                          <p className="text-small text-tone-muted">{item.note}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              ),
            };
          })}
        />
      </Reveal>
    </SectionWrapper>
  );
}
