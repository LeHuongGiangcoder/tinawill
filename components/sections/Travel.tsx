import { GuideGroups } from "@/components/ui/GuideGroups";
import { SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TabSet } from "@/components/ui/TabSet";
import { travel } from "@/content/client";

/**
 * Hướng dẫn tại chỗ: ở đâu, thời tiết thế nào, quanh đó có gì.
 *
 * Hai thẻ thay vì một chồng dài — xem components/sections/Visa.tsx, trang kia
 * dựng y hệt và cùng lý do.
 */
export function Travel() {
  return (
    <SectionWrapper section="travel" width="prose" labelledBy="travel-title">
      <SectionHead
        eyebrow={travel.eyebrow}
        title={travel.title}
        titleId="travel-title"
        intro={travel.intro}
      />

      <Reveal>
        <TabSet
          label={travel.tabsLabel}
          items={travel.tabs.map((tab) => ({
            id: tab.id,
            tab: (
              <>
                <span className="font-display text-h4">{tab.label}</span>
                <span aria-hidden className="tab-mark" />
              </>
            ),
            panel: <GuideGroups groups={tab.groups} />,
          }))}
        />
      </Reveal>
    </SectionWrapper>
  );
}
