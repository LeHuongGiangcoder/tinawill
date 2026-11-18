import { ExperienceProvider } from "@/components/experience/ExperienceProvider";
import { GuestProvider } from "@/components/experience/GuestProvider";
import { Agenda } from "@/components/sections/Agenda";
import { Cover } from "@/components/sections/Cover";
import { Dresscode } from "@/components/sections/Dresscode";
import { Gallery } from "@/components/sections/Gallery";
import { Gifts } from "@/components/sections/Gifts";
import { Hero } from "@/components/sections/Hero";
import { LoveStory } from "@/components/sections/LoveStory";
import { Rsvp } from "@/components/sections/Rsvp";
import { ThankYou } from "@/components/sections/ThankYou";
import { Time } from "@/components/sections/Time";
import { Travel } from "@/components/sections/Travel";
import { Venue } from "@/components/sections/Venue";
import { Visa } from "@/components/sections/Visa";
import { WeddingInfo } from "@/components/sections/WeddingInfo";
import { CatJourney } from "@/components/ui/CatJourney";
import { Motion } from "@/components/ui/Motion";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { LangProvider } from "@/components/experience/LangProvider";
import { LanguagePicker } from "@/components/experience/LanguagePicker";
import { design, sections, type SectionId } from "@/content/client";
import { content, type Lang } from "@/lib/content";

/**
 * Mỗi section một entry. Thêm section mới thì khai tên trong `SectionId`
 * (content/client.ts) rồi thêm một dòng ở đây — không sửa gì khác.
 */
type SectionProps = { lang: Lang };

const SECTIONS: Record<Exclude<SectionId, "intro">, (props: SectionProps) => React.ReactNode> = {
  cover: Cover,
  hero: Hero,
  time: Time,
  loveStory: LoveStory,
  /* Hai section client nhận đúng phần chữ của chúng, không tự nạp bản dịch. */
  gallery: ({ lang }) => <Gallery gallery={content(lang).gallery} />,
  weddingInfo: WeddingInfo,
  venue: Venue,
  visa: Visa,
  travel: Travel,
  agenda: Agenda,
  dresscode: Dresscode,
  rsvp: ({ lang }) => <Rsvp rsvp={content(lang).rsvp} />,
  gifts: Gifts,
  thankYou: ThankYou,
};

/**
 * Cả trang thiệp ở một thứ tiếng. Trang chủ ("/") là tiếng Anh; "/vi", "/de"
 * dựng từ app/[lang]/page.tsx bằng chính component này.
 */
export function Site({ lang }: SectionProps) {
  const { intro, meta } = content(lang);
  /* Màn mở thiệp là trạng thái đóng của cảnh trong Cover (xem TropicalReveal),
     nên nó không render như một section riêng — và không có Cover thì cũng
     không có nút để mở, phải bỏ cổng đi kẻo khoá cuộn mãi. */
  const gated = sections.includes("intro") && sections.includes("cover");
  const flow = sections.filter((id) => id !== "intro");

  return (
    <LangProvider lang={lang} htmlLang={meta.lang} intro={intro}>
    <GuestProvider>
      <ExperienceProvider gated={gated}>
        {/* Toàn bộ chuyển động của trang nằm ở đây, section không tự gọi GSAP */}
        <Motion />

        {/* Popup chọn tiếng, đè lên màn mở thiệp ở lần đầu khách vào */}
        {gated ? <LanguagePicker /> : null}

        {/* `lang` + `data-lang`: trang tiếng Việt đổi bộ chữ có dấu — xem
            `:lang(vi)` trong app/globals.css. */}
        <main className="relative" lang={meta.lang} data-lang={lang}>
          {/* Thứ tự render đúng theo mảng `sections` trong content/client.ts */}
          {flow.map((id) => {
            const Section = SECTIONS[id];
            return <Section key={id} lang={lang} />;
          })}

          {/* Bé mèo chạy qua section ngay trên Save the Date (Hero nếu có, không
              thì trang bìa), rồi nhảy xuống ghế trái của Save the Date. */}
          {flow.includes("time") && flow.indexOf("time") > 0 ? (
            <CatJourney upper={design[flow[flow.indexOf("time") - 1]].anchor} lower="time" />
          ) : null}
        </main>

        <MusicToggle />
      </ExperienceProvider>
    </GuestProvider>
    </LangProvider>
  );
}
