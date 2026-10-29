import Image from "next/image";

import { GuideGroups } from "@/components/ui/GuideGroups";
import { SectionHead } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TabSet } from "@/components/ui/TabSet";
import { travel } from "@/content/client";

/**
 * Hướng dẫn tại chỗ: ở đâu, thời tiết thế nào, quanh đó có gì.
 *
 * Dựng thành một ô cửa sổ: hai cánh cửa đứng yên hai bên, còn hai thẻ nằm
 * cạnh nhau trên một dải rộng gấp đôi phía sau. Bấm thẻ kia thì dải trượt
 * sang — như đứng một chỗ nhìn qua cửa sổ rồi đưa mắt sang bên kia, chứ
 * không phải bên này tắt đi bên kia bật lên.
 *
 * Section vẫn đúng bề ngang màn hình: cái rộng gấp đôi là dải BÊN TRONG, bị
 * `.window` cắt khuất, nên không sinh thanh cuộn ngang.
 *
 * Ô cửa là tranh khách gửi, cắt sẵn bằng `node scripts/window-assets.mjs`:
 * mỗi cánh ba mảnh (nắp trên — ô kính — nắp dưới) để cao bao nhiêu cũng vừa
 * mà không méo phối cảnh, cộng một chậu hoa rời đặt trên bệ cửa. Lý do phải
 * cắt ba nằm trong chính script đó.
 */

const BASE = "/window";

/**
 * Cỡ thật của từng mảnh — script in ra khi chạy. Next cần đúng tỉ lệ để chừa
 * sẵn chỗ, nếu không ô cửa giật một nhịp lúc ảnh về.
 */
const ART = {
  leftTop: { src: `${BASE}/leaf-left-top.webp`, width: 240, height: 827 },
  leftBottom: { src: `${BASE}/leaf-left-bottom.webp`, width: 240, height: 467 },
  rightTop: { src: `${BASE}/leaf-right-top.webp`, width: 240, height: 1124 },
  rightBottom: { src: `${BASE}/leaf-right-bottom.webp`, width: 240, height: 596 },
  plant: { src: `${BASE}/plant.webp`, width: 440, height: 353 },
} as const;

const LEAVES = [
  {
    side: "window-leaf-start",
    top: ART.leftTop,
    pane: `${BASE}/leaf-left-mid.webp`,
    bottom: ART.leftBottom,
  },
  {
    side: "window-leaf-end",
    top: ART.rightTop,
    pane: `${BASE}/leaf-right-mid.webp`,
    bottom: ART.rightBottom,
  },
] as const;

function WindowFrame() {
  return (
    <div aria-hidden className="window-frame">
      {LEAVES.map((leaf) => (
        <span key={leaf.side} className={`window-leaf ${leaf.side}`}>
          <Image
            src={leaf.top.src}
            alt=""
            width={leaf.top.width}
            height={leaf.top.height}
            sizes="(max-width: 40rem) 10vw, 5rem"
            className="h-auto w-full shrink-0 select-none"
          />
          {/* Ô kính giữa là ảnh nền để nó giãn dọc được — xem `.window-leaf-pane` */}
          <span className="window-leaf-pane" style={{ backgroundImage: `url(${leaf.pane})` }} />
          <Image
            src={leaf.bottom.src}
            alt=""
            width={leaf.bottom.width}
            height={leaf.bottom.height}
            sizes="(max-width: 40rem) 10vw, 5rem"
            className="h-auto w-full shrink-0 select-none"
          />
        </span>
      ))}

      <Image
        src={ART.plant.src}
        alt=""
        width={ART.plant.width}
        height={ART.plant.height}
        sizes="(max-width: 40rem) 24vw, 10rem"
        className="window-plant h-auto select-none"
      />
    </div>
  );
}

export function Travel() {
  return (
    <SectionWrapper section="travel" width="bleed" labelledBy="travel-title">
      <div className="container-prose">
        <SectionHead
          eyebrow={travel.eyebrow}
          title={travel.title}
          titleId="travel-title"
          subtitle={travel.subtitle}
          intro={travel.intro}
        />
      </div>

      <Reveal className="container-prose">
        <TabSet
          label={travel.tabsLabel}
          presentation="slide"
          panelsClassName="window"
          overlay={<WindowFrame />}
          items={travel.tabs.map((tab) => ({
            id: tab.id,
            tab: (
              <>
                <span className="font-display text-h4">{tab.label}</span>
                <span aria-hidden className="tab-mark" />
              </>
            ),
            /* Lề trong chừa chỗ cho hai cánh cửa đang đứng đè lên hai mép. */
            panel: (
              <div className="window-pane">
                <GuideGroups groups={tab.groups} />
              </div>
            ),
          }))}
        />
      </Reveal>
    </SectionWrapper>
  );
}
