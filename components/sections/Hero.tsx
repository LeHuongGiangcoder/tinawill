import { GardenStage } from "@/components/ui/GardenStage";
import { Divider } from "@/components/ui/Divider";
import { Caption, Heading } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ceremony, couple, hero, venue } from "@/content/client";

/**
 * Trang bìa: khu vườn mở ra, lời mời nổi trên mặt nước.
 *
 * Nền là <GardenStage> — cùng một cảnh với màn mở thiệp, chỉ khác trạng thái.
 * Lá trượt ra hai mép rồi chữ mới hiện, nên các khối gắn `data-hero`: chúng
 * chờ cú chạm mở thiệp chứ không chờ cuộn (hero nằm ngay dưới màn mở thiệp
 * nên sẽ không bao giờ "cuộn tới").
 */
export function Hero() {
  return (
    <SectionWrapper section="hero" flush width="bleed" labelledBy="hero-title">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center">
        <GardenStage />

        <div className="container-site relative z-20 flex flex-col items-center gap-stack py-section text-center">
          {/* Quầng nền mềm ôm lấy cột chữ, giữ cho chữ đọc được trên mặt nước
              nhiều chi tiết. Nó bám theo khối chữ chứ không phủ cả màn hình,
              nếu không thì màn ngang sẽ bị xám cả mặt sông. */}
          <div data-reveal data-hero aria-hidden className="scrim pointer-events-none absolute inset-0" />
          <p data-reveal data-hero className="font-script text-h3">
            {hero.invitation}
          </p>

          <Heading
            level="display"
            id="hero-title"
            data-reveal
            data-hero
            className="flex flex-col items-center short:text-h1"
          >
            {/* Tina & Will — thiệp gọi tên cô dâu trước */}
            <span>{couple.bride}</span>
            <span className="font-script text-h2 text-tone-accent">&amp;</span>
            <span>{couple.groom}</span>
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

          <p data-reveal data-hero className="mt-block text-eyebrow uppercase text-tone-muted">
            {hero.scrollHint} ↓
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
