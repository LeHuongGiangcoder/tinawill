import { ButtonLink } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { Caption, Heading, Lead } from "@/components/ui/Heading";
import type { GuideAction, TravelGroup } from "@/content/client";

/** Hàng nút cuối một khối. */
function Actions({
  actions,
  compact = false,
}: {
  actions: GuideAction[];
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-stack ${
        compact ? "flex-row flex-wrap" : "flex-col sm:flex-row sm:flex-wrap"
      }`}
    >
      {actions.map((action) => (
        <ButtonLink
          key={action.href}
          href={action.href}
          target="_blank"
          rel="noreferrer noopener"
          variant={compact ? "ghost" : "primary"}
          className={compact ? "btn-compact" : ""}
        >
          {action.label}
        </ButtonLink>
      ))}
    </div>
  );
}

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
      {groups.map((group) =>
        group.kind === "topics" ? (
          /* Khối gập: chỉ mục đầu mở sẵn, và mở mục khác thì mục đang mở gập
             lại (`name` chung) — nên thẻ cao gần như cố định dù bấm mục nào. */
          <div key={group.title} className="flex flex-col gap-stack">
            {group.lead ? <Lead>{group.lead}</Lead> : null}
            <div>
              {group.topics.map((topic, i) => (
                <Disclosure
                  key={topic.label}
                  label={topic.label}
                  name={`guide-${group.title}`}
                  defaultOpen={i === 0}
                >
                  <div className="flex flex-col gap-stack">
                    <p>{topic.body}</p>
                    {topic.actions?.length ? (
                      <Actions actions={topic.actions} compact />
                    ) : null}
                  </div>
                </Disclosure>
              ))}
            </div>
          </div>
        ) : (
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

            {group.actions?.length ? <Actions actions={group.actions} /> : null}
          </div>
        ),
      )}
    </div>
  );
}
