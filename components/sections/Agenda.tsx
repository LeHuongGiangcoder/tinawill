import Image from "next/image";
import { Fragment } from "react";

import { Heading, SectionHead, Subhead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TabSet } from "@/components/ui/TabSet";
import { type AgendaStamp } from "@/content/client";
import { content, type Lang } from "@/lib/content";
import { element } from "@/lib/assets";

/**
 * Chương trình cả cuối tuần. Ba ngày nằm sau ba con tem: bấm con nào mở lịch
 * ngày ấy, nên section cao bằng một ngày thay vì bằng cả ba.
 *
 * Trong mỗi ngày, các mục xếp thành một cột căn giữa: giờ ở trên, tiêu đề rồi
 * ghi chú ở dưới, và giữa hai mục là một mốc nối (đường kẻ – viên thoi –
 * đường kẻ) nằm đúng trục giữa. Mọi thứ cùng một trục nên ngày ít chữ hay
 * nhiều chữ đều cân hai bên, không phải tính cột.
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
  cocktail: {
    frame: "/agenda/cocktail-frame.webp",
    icon: "/agenda/cocktail-icon.webp",
  },
  sun: { frame: "/agenda/sun-frame.webp", icon: "/agenda/sun-icon.webp" },
  monstera: {
    frame: "/agenda/monstera-frame.webp",
    icon: "/agenda/monstera-icon.webp",
  },
};

export function Agenda({ lang }: { lang: Lang }) {
  const { agenda } = content(lang);
  const dancers = element("dancers");

  return (
    <SectionWrapper section="agenda" width="prose" labelledBy="agenda-title">
      {/* Lời mời bấm (chữ đứng, màu chữ chính) rồi ghi chú nghiêng nhỏ về giờ
          giấc, nằm trong SectionHead để cách tiêu đề đúng `gap-stack` như mọi
          section; `tight` cho cả khối sát hàng tem một `stack`. */}
      <SectionHead
        eyebrow={agenda.eyebrow}
        title={agenda.title}
        titleId="agenda-title"
        tight
      >
        <p className="type-body text-balance text-tone-fg">
          {agenda.pickPrompt}
        </p>
        <Subhead>{agenda.pickNote}</Subhead>
      </SectionHead>

      <Reveal>
        <TabSet
          label={agenda.daysLabel}
          /* Hàng tem ôm vừa hai con tem (`w-fit`) và đứng giữa section,
               khe giữa hai cột một `stack` — tem nhỏ, đứng sát nhau thay vì
               dạt ra hai lề. `auto-cols-fr` giữ hai cột bằng nhau dù tên
               ngày dài ngắn khác nhau. */
          listClassName="mx-auto grid w-fit grid-flow-col auto-cols-fr gap-stack"
          items={agenda.days.map((day) => {
            const stamp = STAMPS[day.stamp];
            return {
              id: day.stamp,
              tab: (
                <>
                  {/* Mọi con tem cùng một khổ `w-stamp` và cùng tỉ lệ khung,
                      tranh kéo vừa khung (`object-fill`). Tranh gốc cao thấp
                      lệch nhau vài phần trăm (mặt trời 600×758, monstera
                      600×712) — `object-contain` để lộ chênh lệch đó thành hai
                      khối to nhỏ khác nhau, còn kéo về tỉ lệ giữa (600×735) thì
                      mỗi tranh chỉ co giãn ~3%, mắt không thấy. */}
                  <span className="tab-stamp relative block aspect-[600/735] w-stamp">
                    <Image
                      src={stamp.frame}
                      alt=""
                      fill
                      sizes="8rem"
                      loading="eager"
                      className="object-fill"
                    />
                    {/* Icon cùng khổ với khung nên chồng lên là khớp; chỉ
                        lớp này đung đưa khi tem được chọn. */}
                    <Image
                      src={stamp.icon}
                      alt=""
                      fill
                      sizes="8rem"
                      loading="eager"
                      className="tab-wiggle object-fill"
                    />
                  </span>
                  {/* Ngày rồi tên chủ đề, nằm dưới con tem. Không in thứ: ngày
                      đã đủ, và mỗi tem một dòng ngày thì ba tem luôn thẳng hàng. */}
                  <span className="type-sub-body whitespace-nowrap">
                    {day.date}
                  </span>
                  <span className="type-body">{day.title}</span>
                  <span aria-hidden className="tab-mark" />
                </>
              ),
              panel: (
                <ol className="mx-auto flex max-w-prose flex-col items-center gap-tight text-center">
                  {day.items.map((item, i) => (
                    <Fragment key={`${item.time}-${item.title}`}>
                      <li className="flex flex-col items-center">
                        {/* Nhãn chữ ("Daytime") thấp xuống bậc body: chữ cái cao hơn
                            chữ số kiểu cũ nên cùng bậc subtitle nhìn to hơn giờ. */}
                        <p
                          className={`${/\d/.test(item.time) ? "type-subtitle" : "type-body"} text-tone-accent`}
                        >
                          {item.time}
                        </p>
                        {/* Ghi chú đứng sát tiêu đề của chính nó (không `gap`), để mắt
                            đọc ra "tiêu đề + ghi chú" là một cặp. */}
                        <Heading level="h4">{item.title}</Heading>
                        {item.note ? (
                          <p className="type-note text-balance text-tone-muted">
                            {item.note}
                          </p>
                        ) : null}
                      </li>

                      {/* Mốc nối giữa hai mục: đường kẻ – viên thoi – đường kẻ, nằm
                          đúng trục giữa. Mục cuối không có mốc nối phía sau. */}
                      {i === day.items.length - 1 ? null : (
                        <li aria-hidden className="flex flex-col items-center">
                          <span className="h-tight w-px bg-tone-accent" />
                          <span className="size-2 rotate-45 bg-tone-accent" />
                          <span className="h-tight w-px bg-tone-accent" />
                        </li>
                      )}
                    </Fragment>
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
            loading="eager"
            className="h-auto w-full"
          />
        </Reveal>
      ) : null}
    </SectionWrapper>
  );
}
