import { Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { agenda } from "@/content/client";

/**
 * Trình tự buổi lễ: giờ bên trái, một viên thoi trên trục dọc, nội dung bên
 * phải. Trục kẻ bằng border của phần tử giữa nên nó tự dài đúng bằng hàng,
 * không cần đo chiều cao bằng JS.
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

      <ol className="mx-auto flex max-w-prose flex-col">
        {agenda.items.map((item, i) => (
          <Reveal
            as="li"
            key={`${item.time}-${item.title}`}
            delay={i * 80}
            className="grid grid-cols-[4.5rem_1.5rem_1fr] items-start gap-stack sm:grid-cols-[6rem_1.5rem_1fr]"
          >
            <p className="pt-1 text-right font-display text-h4 text-tone-accent">{item.time}</p>

            {/* Trục dọc: hàng cuối không kẻ tiếp để đường không thừa ra */}
            <div
              aria-hidden
              className={`flex h-full flex-col items-center ${
                i === agenda.items.length - 1 ? "" : "pb-block"
              }`}
            >
              <span className="mt-2 size-2 shrink-0 rotate-45 bg-tone-accent" />
              {i === agenda.items.length - 1 ? null : (
                <span className="mt-tight w-px flex-1 bg-tone-line" />
              )}
            </div>

            <div className="flex flex-col gap-tight pb-block last:pb-0">
              <Heading level="h4">{item.title}</Heading>
              {item.note ? <p className="text-small text-tone-muted">{item.note}</p> : null}
            </div>
          </Reveal>
        ))}
      </ol>
    </SectionWrapper>
  );
}
