import { Divider } from "@/components/ui/Divider";
import { Caption, Eyebrow, Heading, Lead } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, couple, hero, venue } from "@/content/client";

/**
 * Trang bìa: tên hai người, ngày giờ, một dòng mời.
 *
 * Các khối gắn `data-hero` nên chúng hiện theo cú chạm mở thiệp chứ không chờ
 * cuộn — hero nằm ngay dưới màn mở thiệp nên sẽ không bao giờ "cuộn tới".
 */
export function Hero() {
  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <div className="container-site flex min-h-[100svh] flex-col items-center justify-center gap-stack py-section text-center">
        <Eyebrow data-reveal data-hero>
          {hero.eyebrow}
        </Eyebrow>

        <Heading
          level="display"
          id="hero-title"
          data-reveal
          data-hero
          className="flex flex-col items-center short:text-h1"
        >
          <span>{couple.groom}</span>
          <span className="font-script text-h2 text-tone-accent">&amp;</span>
          <span>{couple.bride}</span>
        </Heading>

        <div data-reveal data-hero className="flex flex-col items-center gap-tight">
          <Divider diamond />
          <Lead>{hero.headline}</Lead>
          <p className="font-display text-h3">
            {ceremony.weekday}, {ceremony.dateShort}
          </p>
          <Caption>
            {ceremony.timeLabel} · {venue.name}
          </Caption>
        </div>

        <p data-reveal data-hero className="mt-block text-eyebrow uppercase text-tone-muted">
          {hero.scrollHint} ↓
        </p>
      </div>
    </SectionWrapper>
  );
}
