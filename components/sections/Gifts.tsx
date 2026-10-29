import { ButtonLink } from "@/components/ui/Button";
import { Caption, Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { gifts } from "@/content/client";

/**
 * Quà cưới & honeymoon fund: ba lựa chọn, mỗi lựa chọn một thẻ giấy.
 *
 * Thẻ nào chưa có link (ví dụ chưa có thông tin chuyển khoản) thì phần nút tự
 * ẩn — thêm link vào `actions` trong content/client.ts là nút hiện ra.
 */
export function Gifts() {
  return (
    <SectionWrapper section="gifts" width="prose" labelledBy="gifts-title">
      <SectionHead
        eyebrow={gifts.eyebrow}
        title={gifts.title}
        titleId="gifts-title"
        subtitle={gifts.subtitle}
        intro={gifts.intro}
      />

      <div className="flex flex-col gap-stack">
        {gifts.options.map((option, i) => (
          <Reveal key={option.title} delay={i * 70} className="card flex flex-col gap-tight">
            <Heading level="h4">{option.title}</Heading>
            <p className="text-small text-tone-muted">{option.body}</p>
            {option.note ? <Caption>{option.note}</Caption> : null}

            {option.actions.length ? (
              <div className="mt-tight flex flex-col items-start gap-stack sm:flex-row sm:flex-wrap">
                {option.actions.map((action) => (
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
