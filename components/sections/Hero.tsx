import { Divider } from "@/components/ui/Divider";
import { Caption, Heading } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TropicalReveal } from "@/components/ui/TropicalReveal";
import { ceremony, couple, hero, venue } from "@/content/client";

/**
 * Trang bìa: tán lá mở ra, lời mời nổi trên mặt nước.
 *
 * Nền là <TropicalReveal> — cùng một cảnh với màn mở thiệp, chỉ khác trạng
 * thái. Tán lá mở ra để lộ nền giấy xanh rồi chữ mới hiện, nằm giữa trang, nên các khối gắn
 * `data-hero`: chúng chờ cú chạm mở thiệp chứ không chờ cuộn (hero đứng ngay
 * đầu trang nên sẽ không bao giờ "cuộn tới"). Nhịp chờ là `motion.heroDelay`.
 */
export function Hero() {
  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center">
        <TropicalReveal />

        <div className="container-site relative z-20 flex flex-col items-center gap-stack text-center">
          <p data-reveal data-hero className="font-script text-h3 text-balance">
            {hero.invitation}
          </p>

          <Heading
            level="display"
            id="hero-title"
            data-reveal
            data-hero
            className="flex items-baseline justify-center gap-tight short:text-h1"
          >
            <span>{couple.groom}</span>
            <span className="font-script text-h2 text-tone-accent">&amp;</span>
            <span>{couple.bride}</span>
          </Heading>

          <div data-reveal data-hero className="flex flex-col items-center gap-tight">
            <Divider diamond />
            <p className="font-display text-h3">
              {ceremony.weekday}, {ceremony.dateShort}
            </p>
            <Caption>
              {ceremony.timeLabel} · {venue.name}
            </Caption>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-section">
          <p data-reveal data-hero className="text-eyebrow uppercase text-tone-muted">
            {hero.scrollHint} ↓
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
