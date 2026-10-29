import { GuideGroups } from "@/components/ui/GuideGroups";
import { SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TabSet } from "@/components/ui/TabSet";
import { visa } from "@/content/client";

/**
 * Giấy tờ và đường bay — hai việc khách phải lo trước khi lên đường.
 *
 * Hai thẻ chứ không phải một chồng dài: khách Châu Âu không cần đọc phần
 * e-visa, khách bay thẳng từ Bangkok không cần đọc phần nối chuyến. Để cả
 * bốn khối cùng lúc thì ai cũng phải cuộn qua phần không liên quan tới mình.
 *
 * Giống Agenda, bên trong thẻ KHÔNG dùng <Reveal> — xem
 * components/ui/TabSet.tsx.
 */
export function Visa() {
  return (
    <SectionWrapper section="visa" width="prose" labelledBy="visa-title">
      <SectionHead
        eyebrow={visa.eyebrow}
        title={visa.title}
        titleId="visa-title"
        intro={visa.intro}
      />

      <Reveal>
        <TabSet
          label={visa.tabsLabel}
          items={visa.tabs.map((tab) => ({
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
