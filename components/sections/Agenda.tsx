import Image from "next/image";

import { Heading, Lead, SectionHead } from "@/components/ui/Heading";
import { Highlighted } from "@/components/ui/Highlight";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TabSet } from "@/components/ui/TabSet";
import { agenda, type AgendaStamp } from "@/content/client";
import { element } from "@/lib/assets";

/**
 * Chương trình cả cuối tuần. Ba ngày nằm sau ba con tem: bấm con nào mở lịch
 * ngày ấy, nên section cao bằng một ngày thay vì bằng cả ba.
 *
 * Trong mỗi ngày là trục thời gian — giờ bên trái, một viên thoi trên trục
 * dọc, nội dung bên phải. Cả khối `w-fit` rồi `mx-auto`: bề ngang bằng đúng
 * nội dung của ngày ấy và nằm giữa section, nên ngày ít chữ không bị dồn về
 * một bên. Ba cột dùng chung lưới (subgrid) để giờ và tiêu đề thẳng hàng
 * giữa các mốc. Trục kẻ bằng chiều cao của hàng nên tự dài đúng bằng hàng,
 * không cần đo bằng JS.
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
  const dancers = element("dancers");

  return (
    <SectionWrapper section="agenda" width="prose" labelledBy="agenda-title">
      <SectionHead
        eyebrow={agenda.eyebrow}
        title={agenda.title}
        titleId="agenda-title"
        tight
      >
        <p className="type-sub-body text-tone-fg">{agenda.intro}</p>
        <Lead className="max-w-prose text-balance">
          <Highlighted text={agenda.hint} words={agenda.highlight} />
        </Lead>
      </SectionHead>

      <Reveal className="-mt-tight">
        <TabSet
          label={agenda.daysLabel}
          items={agenda.days.map((day, index) => {
            const stamp = STAMPS[day.stamp];
            /* Hai con tem ngoài cùng bám sát mép hàng: tranh nằm sát mép hộp
               (object-left / object-right) và lúc được chọn (scale 1.04) nó
               nở vào trong chứ không tràn ra, nên khoảng trống từ mép tem tới
               mép section hai bên luôn bằng nhau, chọn tem nào cũng vậy. Con
               giữa nằm giữa hộp, nở đều hai phía. */
            const edge =
              index === 0
                ? { box: "origin-left", pos: "object-left" }
                : index === agenda.days.length - 1
                  ? { box: "origin-right", pos: "object-right" }
                  : { box: "", pos: "object-center" };

            return {
              id: day.stamp,
              tab: (
                <>
                  {/* Ba con tem cao thấp khác nhau (ly martini thấp, mặt trời
                      cao), nên mỗi con nằm trong một khung cùng tỉ lệ và
                      `object-contain` — có vậy ba dòng chữ dưới tem mới thẳng
                      hàng thay vì so le theo chiều cao tranh. */}
                  <span className={`tab-stamp relative block aspect-[6/7] w-full ${edge.box}`}>
                    <Image
                      src={stamp.frame}
                      alt=""
                      fill
                      sizes="(max-width: 40rem) 30vw, 11rem"
                      className={`object-contain ${edge.pos}`}
                    />
                    {/* Icon cùng khổ với khung nên chồng lên là khớp; chỉ
                        lớp này đung đưa khi tem được chọn. */}
                    <Image
                      src={stamp.icon}
                      alt=""
                      fill
                      sizes="(max-width: 40rem) 30vw, 11rem"
                      className={`tab-wiggle object-contain ${edge.pos}`}
                    />
                  </span>
                  {/* Ngày rồi tên chủ đề, nằm dưới con tem đúng như bản mẫu */}
                  {/* Thứ và ngày luôn hai dòng riêng ("Friday" / "March 26"),
                      để ba con tem xuống dòng giống hệt nhau thay vì mỗi cái
                      gãy một chỗ tuỳ độ dài tên thứ. */}
                  <span className="type-sub-body flex flex-col">
                    <span>{day.weekday}</span>
                    <span className="whitespace-nowrap">{day.date}</span>
                  </span>
                  <span className="type-body">{day.title}</span>
                  <span aria-hidden className="tab-mark" />
                </>
              ),
              panel: (
                <ol className="mx-auto grid w-fit max-w-full grid-cols-[auto_1.5rem_minmax(0,15rem)] gap-x-tight">
                  {day.items.map((item, i) => (
                    <li
                      key={`${item.time}-${item.title}`}
                      className="col-span-3 grid grid-cols-subgrid items-start pb-block last:pb-0"
                    >
                      {/* Nhãn chữ ("Daytime") thấp xuống bậc body: chữ cái cao hơn
                          chữ số kiểu cũ nên cùng bậc subtitle nhìn to hơn giờ. */}
                      <p
                        className={`${/\d/.test(item.time) ? "type-subtitle" : "type-body"} text-right text-tone-accent`}
                      >
                        {item.time}
                      </p>

                      {/* Trục dọc: đường kẻ nối mốc này tới mốc kế tiếp. Cột phải
                          `self-stretch` — `h-full` trên ô lưới `items-start` không
                          có chiều cao để ăn theo nên đường kẻ biến mất. `-mb-2`
                          kéo đường xuống chạm đỉnh mốc dưới (cách `mt-2`); hàng
                          cuối không kẻ tiếp để đường không thừa ra. */}
                      <div aria-hidden className="flex flex-col items-center self-stretch">
                        <span className="mt-2 size-2 shrink-0 rotate-45 bg-tone-accent" />
                        {i === day.items.length - 1 ? null : (
                          <span className="-mb-2 w-px flex-1 bg-tone-accent" />
                        )}
                      </div>

                      {/* Ghi chú đứng sát tiêu đề của chính nó (không `gap`) và cách mốc kế
                          tiếp bằng `pb-block` ở <li>, để mắt đọc ra "tiêu đề + ghi chú" là một cặp. */}
                      <div className="flex flex-col">
                        <Heading level="h4">{item.title}</Heading>
                        {item.note ? (
                          <p className="type-note text-balance text-tone-muted">{item.note}</p>
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

      {/* Đoàn người nhảy múa khép section lại. Nằm trong dòng chảy chứ không
          phải `decor` tuyệt đối, vì section cao thấp theo ngày đang mở — hoạ
          tiết neo đáy sẽ đè lên mốc cuối của lịch. `-mb-section` cho chân
          họ đứng đúng trên mép dưới của tờ giấy. */}
      {dancers ? (
        <Reveal className="mx-auto mt-block -mb-section w-full max-w-prose">
          <Image
            src={dancers.src}
            alt=""
            width={dancers.width ?? 1672}
            height={dancers.height ?? 589}
            sizes="(max-width: 40rem) 100vw, 40rem"
            className="h-auto w-full"
          />
        </Reveal>
      ) : null}
    </SectionWrapper>
  );
}
