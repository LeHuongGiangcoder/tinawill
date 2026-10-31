import { ExperienceProvider } from "@/components/experience/ExperienceProvider";
import { GuestProvider } from "@/components/experience/GuestProvider";
import { Agenda } from "@/components/sections/Agenda";
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
import { Motion } from "@/components/ui/Motion";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { sections, type SectionId } from "@/content/client";

/**
 * Mỗi section một entry. Thêm section mới thì khai tên trong `SectionId`
 * (content/client.ts) rồi thêm một dòng ở đây — không sửa gì khác.
 */
const SECTIONS: Record<Exclude<SectionId, "intro">, () => React.ReactNode> = {
  hero: Hero,
  time: Time,
  loveStory: LoveStory,
  gallery: Gallery,
  weddingInfo: WeddingInfo,
  venue: Venue,
  visa: Visa,
  travel: Travel,
  agenda: Agenda,
  dresscode: Dresscode,
  rsvp: Rsvp,
  gifts: Gifts,
  thankYou: ThankYou,
};

export default function Page() {
  /* Màn mở thiệp là trạng thái đóng của cảnh trong Hero (xem TropicalReveal),
     nên nó không render như một section riêng — và không có Hero thì cũng
     không có nút để mở, phải bỏ cổng đi kẻo khoá cuộn mãi. */
  const gated = sections.includes("intro") && sections.includes("hero");
  const flow = sections.filter((id) => id !== "intro");

  return (
    <GuestProvider>
      <ExperienceProvider gated={gated}>
        {/* Toàn bộ chuyển động của trang nằm ở đây, section không tự gọi GSAP */}
        <Motion />

        <main>
          {/* Thứ tự render đúng theo mảng `sections` trong content/client.ts */}
          {flow.map((id) => {
            const Section = SECTIONS[id];
            return <Section key={id} />;
          })}
        </main>

        <MusicToggle />
      </ExperienceProvider>
    </GuestProvider>
  );
}
