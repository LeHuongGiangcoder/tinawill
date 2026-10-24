import { Caption, Eyebrow, Heading, Lead, SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { dresscode } from "@/content/client";

/**
 * Trang phục: câu dẫn, bảng màu, rồi gợi ý cho từng nhóm khách.
 *
 * Ô màu đọc hex thẳng từ client.ts — đây là chỗ duy nhất trong site được phép
 * nhận mã màu từ nội dung, vì bảng màu là nội dung của khách chứ không phải
 * theme của site. Bảng màu xếp ba cột trên điện thoại, sáu cột từ sm trở lên,
 * nên sáu màu không bị bóp thành sọc mỏng trên màn hẹp.
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
        <Lead className="max-w-prose">{dresscode.note}</Lead>
      </Reveal>

      {dresscode.swatches.length > 0 ? (
        <Reveal delay={90} className="mt-block flex flex-col items-center gap-stack">
          <ul className="grid w-full max-w-[22rem] grid-cols-3 gap-stack sm:max-w-none sm:grid-cols-6">
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
        </Reveal>
      ) : null}

      {dresscode.notes.length > 0 ? (
        <div className="mt-block flex flex-col gap-stack">
          {dresscode.notes.map((note, i) => (
            <Reveal key={note.label} delay={i * 60} className="flex flex-col gap-tight">
              <Eyebrow>{note.label}</Eyebrow>
              <p className="text-small text-tone-muted">{note.body}</p>
            </Reveal>
          ))}
        </div>
      ) : null}

      {dresscode.avoid ? (
        <Reveal delay={120} className="mt-block flex justify-center">
          <Caption className="text-center">{dresscode.avoid}</Caption>
        </Reveal>
      ) : null}
    </SectionWrapper>
  );
}
