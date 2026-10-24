import { Divider } from "@/components/ui/Divider";
import { Eyebrow, Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { agenda } from "@/content/client";

/**
 * Chương trình cả cuối tuần: mỗi ngày một khối, trong khối là trục thời gian
 * — giờ bên trái, một viên thoi trên trục dọc, nội dung bên phải. Trục kẻ bằng
 * border của phần tử giữa nên nó tự dài đúng bằng hàng, không cần đo bằng JS.
 *
 * Cột giờ rộng cố định và chữ nhỏ hơn tiêu đề, vì nhãn "Daytime" dài hơn một
 * mốc giờ và không được đẩy cả hàng lệch đi.
 */
export function Agenda() {
  return (
    <SectionWrapper section="agenda" labelledBy="agenda-title">
      <SectionHead
        eyebrow={agenda.eyebrow}
        title={agenda.title}
        titleId="agenda-title"
        intro={agenda.intro}
      />

      <div className="mx-auto flex max-w-prose flex-col gap-block">
        {agenda.days.map((day) => (
          <div key={day.label} className="flex flex-col gap-stack">
            <Reveal className="flex flex-col items-center gap-tight text-center">
              <Eyebrow>{day.label}</Eyebrow>
              <Heading level="h3">{day.title}</Heading>
              <Divider diamond />
            </Reveal>

            <ol className="flex flex-col">
              {day.items.map((item, i) => (
                <Reveal
                  as="li"
                  key={`${item.time}-${item.title}`}
                  delay={i * 70}
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
                    {item.note ? <p className="text-small text-tone-muted">{item.note}</p> : null}
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
