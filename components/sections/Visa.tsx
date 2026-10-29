import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Caption, Heading, Lead, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TabSet } from "@/components/ui/TabSet";
import { visa } from "@/content/client";
import { background as resolveBackground, element as resolveElement } from "@/lib/assets";

/**
 * Giấy tờ và đường bay — xếp theo hộ chiếu, không theo chủ đề.
 *
 * Khách bấm lá cờ của mình rồi chỉ thấy đúng phần của mình: cần visa hay
 * không, nếu cần thì sáu bước xin e-visa, và bay đường nào. Vì sao bỏ cách
 * cũ (hai thẻ "Visa" / "Flights", mỗi thẻ liệt kê cả sáu quốc tịch) — xem
 * `visa` trong content/client.ts.
 *
 * Mặt nhìn: nền section là dải sọc đỏ–kem khách gửi, chữ nằm trên một tờ
 * giấy beige đặt lên trên. Nền sọc quá rộn để đọc chữ trực tiếp, mà vạch kem
 * của nó gần như trùng màu tờ giấy nên tờ giấy hoà vào nền thay vì dán đè.
 *
 * Giống Agenda, bên trong thẻ KHÔNG dùng <Reveal> — xem
 * components/ui/TabSet.tsx.
 */
export function Visa() {
  const sheet = resolveBackground("paper-beige");

  return (
    <SectionWrapper section="visa" width="prose" labelledBy="visa-title">
      {/* Tờ giấy có tông riêng: mực trên beige thay cho chữ kem trên sọc đỏ.
          `data-tone` lật cả bảng màu nên nút, gạch, chữ phụ bên trong tự đổi
          theo mà không phải truyền prop xuống từng cái. */}
      <Reveal>
        <div data-tone="beige" className="sheet">
        {sheet ? (
          <Image
            src={sheet.src}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 48rem) 100vw, 40rem"
            className="-z-10 object-cover"
          />
        ) : null}

        <SectionHead
          eyebrow={visa.eyebrow}
          title={visa.title}
          titleId="visa-title"
          subtitle={visa.subtitle}
          intro={visa.intro}
        />

        <TabSet
          label={visa.regionsLabel}
          /* Hai hàng ba ở mọi khổ màn. Một hàng sáu thì ngay cả trên desktop
             cũng không đủ chỗ: tờ giấy rộng tối đa 40rem, chia sáu còn chưa
             tới 90px mỗi cột và "Southeast Asia" tràn sang tên bên cạnh. */
          listClassName="grid grid-cols-3 gap-stack"
          tabClassName="tab-boxed"
          items={visa.regions.map((region) => {
            const flag = resolveElement(region.flag);
            const route = visa.routes[region.route];

            return {
              id: region.id,
              tab: (
                <>
                  {/* Sáu lá cờ cao thấp khác nhau, nên mỗi lá nằm trong một
                      khung cùng tỉ lệ 3/2 và `object-cover` — có vậy hàng cờ
                      mới thẳng và sáu cái tên dưới cờ mới ngang nhau. */}
                  {flag ? (
                    <span className="tab-wave relative block aspect-[3/2] w-full overflow-hidden rounded-paper">
                      <Image
                        src={flag.src}
                        alt=""
                        fill
                        sizes="(max-width: 40rem) 30vw, 7rem"
                        className="tab-stamp object-cover"
                      />
                    </span>
                  ) : null}
                  <span className="font-display text-h4">{region.label}</span>
                </>
              ),
              panel: (
                <div className="flex flex-col gap-block">
                  <div className="flex flex-col gap-stack">
                    <Heading level="h3">{visa.visaHeading}</Heading>
                    <Lead>{region.verdict}</Lead>
                    {region.note ? <p>{region.note}</p> : null}
                  </div>

                  {/* Sáu bước chỉ hiện với hộ chiếu thật sự cần e-visa —
                      khách Châu Âu và Đông Nam Á không phải đọc. */}
                  {region.needsEvisa ? (
                    <div className="card flex flex-col gap-stack">
                      <Heading level="h4">{visa.evisa.title}</Heading>
                      <ol className="flex list-decimal flex-col gap-stack pl-stack marker:font-display marker:text-tone-accent">
                        {visa.evisa.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>
                      <ButtonLink
                        className="self-start"
                        href={visa.evisa.action.href}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {visa.evisa.action.label}
                      </ButtonLink>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-stack">
                    <Heading level="h3">{visa.flightHeading}</Heading>
                    <Lead>{route.lead}</Lead>
                    <ul className="flex list-disc flex-col gap-stack pl-stack marker:text-tone-accent">
                      {route.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            };
          })}
        />

        {/* Đường từ sân bay về resort: ai cũng đọc, nên nó nằm ngoài khối
            chọn hộ chiếu thay vì chép lại sáu lần. */}
        <div className="mt-block flex flex-col gap-tight border-t border-tone-line pt-block">
          <Heading level="h4">{visa.airport.title}</Heading>
          <Caption>{visa.airport.body}</Caption>
          </div>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
