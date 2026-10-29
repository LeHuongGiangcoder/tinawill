import { ButtonLink } from "@/components/ui/Button";
import { Caption, Heading, Lead } from "@/components/ui/Heading";
import type { TravelGroup } from "@/content/client";

/**
 * Một chồng khối hướng dẫn — dùng chung cho trang Visa và trang Travel.
 *
 * Khối nào cũng lấy hình dáng từ `kind` trong content/client.ts, nên thêm hay
 * bớt một mục hướng dẫn là sửa nội dung chứ không sửa file này.
 *
 * KHÔNG bọc <Reveal> ở đây: chồng khối này nằm trong một thẻ của TabSet, mà
 * thẻ đang ẩn thì không có kích thước để GSAP tính mốc cuộn — xem
 * components/ui/TabSet.tsx.
 */
export function GuideGroups({ groups }: { groups: TravelGroup[] }) {
  return (
    <div className="flex flex-col gap-block">
      {groups.map((group) => (
        <div
          key={group.title}
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
        </div>
      ))}
    </div>
  );
}
