import { ButtonLink } from "@/components/ui/Button";
import { Caption, Heading, Lead, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { travel } from "@/content/client";

/**
 * Hướng dẫn visa & đi lại — section dài nhất của site, nên nó chỉ là một
 * chồng khối chữ trong cột `prose`: đọc trên điện thoại không phải kéo ngang.
 *
 * Khối nào cũng lấy hình dáng từ `kind` trong content/client.ts, nên thêm hay
 * bớt một mục hướng dẫn là sửa nội dung chứ không sửa file này.
 */
export function Travel() {
  return (
    <SectionWrapper section="travel" width="prose" labelledBy="travel-title">
      <SectionHead
        eyebrow={travel.eyebrow}
        title={travel.title}
        titleId="travel-title"
        intro={travel.intro}
      />

      <div className="flex flex-col gap-block">
        {travel.groups.map((group, i) => (
          <Reveal
            key={group.title}
            delay={i * 60}
            className={`flex flex-col gap-stack ${group.highlight ? "card" : ""}`}
          >
            <div className="flex flex-col gap-tight">
              <Heading level="h3">{group.title}</Heading>
              {group.lead ? <Lead>{group.lead}</Lead> : null}
            </div>

            {group.kind === "text" ? (
              <div className="flex flex-col gap-stack">
                {group.items.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            ) : null}

            {group.kind === "bullets" ? (
              <ul className="flex list-disc flex-col gap-stack pl-stack marker:text-tone-accent">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}

            {group.kind === "steps" ? (
              <ol className="flex list-decimal flex-col gap-stack pl-stack marker:font-display marker:text-tone-accent">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : null}

            {group.note ? <Caption>{group.note}</Caption> : null}

            {group.actions?.length ? (
              <div className="flex flex-col gap-stack sm:flex-row sm:flex-wrap">
                {group.actions.map((action) => (
                  <ButtonLink
                    key={action.href}
                    href={action.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {action.label}
                  </ButtonLink>
                ))}
              </div>
            ) : null}
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
