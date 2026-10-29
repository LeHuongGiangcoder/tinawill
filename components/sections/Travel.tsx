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
 * Dựng thành một ô cửa sổ thật: khung bao quanh nội dung, hai cánh khép lại
 * che hết, và một nút "Can't wait" đứng trên cánh. Bấm nút thì hai cánh xoay
 * mở vào trong, một dấu son bay ra phía người xem, rồi hàng thẻ và nội dung
 * mới hiện. Trạng thái đóng/mở do `gate` của TabSet giữ, CSS đọc qua
 * `data-gate` — xem components/ui/TabSet.tsx.
 *
 * Hai thẻ nằm cạnh nhau trên một dải rộng gấp đôi phía sau khung. Bấm thẻ kia
 * thì dải trượt sang — như đứng một chỗ nhìn qua cửa sổ rồi đưa mắt sang bên
 * kia, chứ không phải bên này tắt đi bên kia bật lên.
 *
 * Section vẫn đúng bề ngang màn hình: cái rộng gấp đôi là dải BÊN TRONG, bị
 * `.window` cắt khuất, nên không sinh thanh cuộn ngang.
 *
 * Khung và hai cánh là tranh khách gửi, cắt sẵn bằng
 * `node scripts/travel-window.mjs`: mỗi tấm ba mảnh (nắp trên — khúc giữa —
 * nắp dưới) để cao bao nhiêu cũng vừa mà không méo. Lý do phải cắt ba nằm
 * trong chính script đó.
 */

const BASE = "/window";

/**
 * Cỡ thật của từng mảnh — script in ra khi chạy. Next cần đúng tỉ lệ để chừa
 * sẵn chỗ, nếu không ô cửa giật một nhịp lúc ảnh về.
 */
const ART = {
  frameTop: { src: `${BASE}/frame-top.webp`, width: 1400, height: 151 },
  frameBottom: { src: `${BASE}/frame-bottom.webp`, width: 1400, height: 275 },
  leftTop: { src: `${BASE}/sash-left-top.webp`, width: 600, height: 107 },
  leftBottom: { src: `${BASE}/sash-left-bottom.webp`, width: 600, height: 110 },
  rightTop: { src: `${BASE}/sash-right-top.webp`, width: 600, height: 87 },
  rightBottom: {
    src: `${BASE}/sash-right-bottom.webp`,
    width: 600,
    height: 116,
  },
  kiss: { src: `${BASE}/kiss.webp`, width: 520, height: 456 },
} as const;

/**
 * Hai cánh. `side` quyết chỗ đứng và bản lề: cánh trái treo ở mép trái, cánh
 * phải ở mép phải, nên mở ra là hai mép trong cùng lùi vào.
 *
 * Bề ngang hai cánh không bằng nhau (39.6% và 40.7% bề ngang khung) — số đo
 * lấy từ chính tấm tranh; ép bằng nhau là lệch chỗ hai cánh giáp mí.
 */
const SASHES = [
  {
    side: "window-sash-start",
    top: ART.leftTop,
    glass: `${BASE}/sash-left-mid.webp`,
    bottom: ART.leftBottom,
  },
  {
    side: "window-sash-end",
    top: ART.rightTop,
    glass: `${BASE}/sash-right-mid.webp`,
    bottom: ART.rightBottom,
  },
] as const;

function WindowFrame() {
  return (
    <div aria-hidden className="window-frame">
      <Image
        src={ART.frameTop.src}
        alt=""
        width={ART.frameTop.width}
        height={ART.frameTop.height}
        sizes="(max-width: 40rem) 100vw, 36rem"
        className="h-auto w-full shrink-0 select-none"
      />

      {/* Khúc giữa: chỉ còn hai đố dọc, giữa trống. Là ảnh nền để nó giãn dọc
          được, và cũng là chỗ đứng của hai cánh. */}
      <div
        className="window-opening"
        style={{ backgroundImage: `url(${BASE}/frame-mid.webp)` }}
      >
        {SASHES.map((sash) => (
          <span key={sash.side} className={`window-sash ${sash.side}`}>
            <Image
              src={sash.top.src}
              alt=""
              width={sash.top.width}
              height={sash.top.height}
              sizes="(max-width: 40rem) 40vw, 15rem"
              className="h-auto w-full shrink-0 select-none"
            />
            {/* Bốn hàng ô kính gom thành một mảnh: giãn dọc thì cả bốn hàng
                cùng cao thêm một chút, không hàng nào phình lệch. */}
            <span
              className="window-sash-glass"
              style={{ backgroundImage: `url(${sash.glass})` }}
            />
            <Image
              src={sash.bottom.src}
              alt=""
              width={sash.bottom.width}
              height={sash.bottom.height}
              sizes="(max-width: 40rem) 40vw, 15rem"
              className="h-auto w-full shrink-0 select-none"
            />
          </span>
        ))}

        {/* Dấu son: nằm im sau cánh, cửa mở thì nó lao thẳng về phía người xem. */}
        <Image
          src={ART.kiss.src}
          alt=""
          width={ART.kiss.width}
          height={ART.kiss.height}
          sizes="30vw"
          className="window-kiss h-auto select-none"
        />
      </div>

      <Image
        src={ART.frameBottom.src}
        alt=""
        width={ART.frameBottom.width}
        height={ART.frameBottom.height}
        sizes="(max-width: 40rem) 100vw, 36rem"
        className="h-auto w-full shrink-0 select-none"
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
          gate={{ label: travel.gateLabel }}
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
