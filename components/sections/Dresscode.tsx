import { Caption, Heading, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { dresscode } from "@/content/client";

/**
 * Trang phục: một câu dẫn và bảng màu.
 *
 * Ô màu đọc hex thẳng từ client.ts — đây là chỗ duy nhất trong site được phép
 * nhận mã màu từ nội dung, vì bảng màu là nội dung của khách chứ không phải
 * theme của site.
 */
export function Dresscode() {
  return (
    <SectionWrapper section="dresscode" width="prose" labelledBy="dresscode-title">
      <SectionHead
        eyebrow={dresscode.eyebrow}
        title={dresscode.title}
        titleId="dresscode-title"
      />

      <Reveal className="flex flex-col items-center gap-stack text-center">
        <Heading level="h3">{dresscode.headline}</Heading>
        <Caption className="max-w-prose">{dresscode.note}</Caption>
      </Reveal>

      {dresscode.swatches.length > 0 ? (
        <Reveal delay={90} className="mt-block flex flex-col items-center gap-stack">
          <ul className="grid w-full max-w-[18rem] grid-cols-4 gap-stack">
            {dresscode.swatches.map((swatch) => (
              <li key={swatch.hex} className="flex flex-col items-center gap-tight">
                <span
                  aria-hidden
                  className="aspect-[3/4] w-full rounded-paper border border-tone-line"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="text-small text-tone-muted">{swatch.name}</span>
              </li>
            ))}
          </ul>
          {dresscode.avoid ? <Caption className="text-center">{dresscode.avoid}</Caption> : null}
        </Reveal>
      ) : null}
    </SectionWrapper>
  );
}
