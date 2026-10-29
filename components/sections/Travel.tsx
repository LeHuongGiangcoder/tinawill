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
 * Dựng thành một ô cửa sổ chớp thật: khung đỏ bao quanh nội dung, hai cánh
 * chớp xanh khép lại che hết, và một nút "Can't wait" đứng trên cánh. Bấm nút
 * thì hai cánh xoay mở vào trong, chữ hiện ra trước, rồi chừng một giây rưỡi
 * sau dấu son mới bay ra phía người xem. Trạng thái đóng/mở do `gate` của
 * TabSet giữ, CSS đọc qua `data-gate` — xem components/ui/TabSet.tsx.
 *
 * Hai thẻ nằm cạnh nhau trên một dải rộng gấp đôi phía sau khung. Bấm thẻ kia
 * thì dải trượt sang — như đứng một chỗ nhìn qua cửa sổ rồi đưa mắt sang bên
 * kia, chứ không phải bên này tắt đi bên kia bật lên.
 *
 * Section vẫn đúng bề ngang màn hình: cái rộng gấp đôi là dải BÊN TRONG, bị
 * `.window` cắt khuất, nên không sinh thanh cuộn ngang.
 *
 * Khung và cánh đều tách ra từ MỘT tấm tranh khách gửi, bằng
 * `node scripts/travel-window.mjs`. Chỉ có một cánh: cánh phải là chính nó lật
 * gương. Mỗi mảnh cắt ba (nắp trên — khúc giữa — nắp dưới) để cao bao nhiêu
 * cũng vừa mà không méo; lý do nằm trong chính script đó.
 */

const BASE = "/window";

/**
 * Cỡ thật của từng mảnh — script in ra khi chạy. Next cần đúng tỉ lệ để chừa
 * sẵn chỗ, nếu không ô cửa giật một nhịp lúc ảnh về.
 */
const ART = {
  frameTop: { src: `${BASE}/shutter-frame-top.webp`, width: 1400, height: 193 },
  frameBottom: { src: `${BASE}/shutter-frame-bottom.webp`, width: 1400, height: 175 },
  leafTop: { src: `${BASE}/shutter-leaf-top.webp`, width: 640, height: 326 },
  leafBottom: { src: `${BASE}/shutter-leaf-bottom.webp`, width: 640, height: 882 },
  kiss: { src: `${BASE}/kiss.webp`, width: 520, height: 456 },
} as const;

/**
 * Hai cánh dùng chung một bộ ảnh. `window-leaf-start` treo ở mép trái, còn
 * `window-leaf-end` ở mép phải và được lật gương (`-scale-x-100`) — bản lề
 * luôn nằm ở mép ngoài, mép khép giữa luôn ở trong.
 */
const LEAVES = [
  { side: "window-leaf-start", flip: "" },
  { side: "window-leaf-end", flip: "-scale-x-100" },
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

      {/* Khúc giữa của khung: chỉ còn hai trụ dọc, giữa thủng. Là ảnh nền để
          nó giãn dọc được, và cũng là chỗ đứng của hai cánh. */}
      <div
        className="window-opening"
        style={{ backgroundImage: `url(${BASE}/shutter-frame-mid.webp)` }}
      >
        {LEAVES.map((leaf) => (
          <span key={leaf.side} className={`window-leaf ${leaf.side}`}>
            <Image
              src={ART.leafTop.src}
              alt=""
              width={ART.leafTop.width}
              height={ART.leafTop.height}
              sizes="(max-width: 40rem) 40vw, 15rem"
              className={`h-auto w-full shrink-0 select-none ${leaf.flip}`}
            />
            {/* Khúc lam ở giữa: ảnh nền để giãn dọc cho vừa khoảng trống. */}
            <span
              className={`window-leaf-louvers ${leaf.flip}`}
              style={{ backgroundImage: `url(${BASE}/shutter-leaf-mid.webp)` }}
            />
            <Image
              src={ART.leafBottom.src}
              alt=""
              width={ART.leafBottom.width}
              height={ART.leafBottom.height}
              sizes="(max-width: 40rem) 40vw, 15rem"
              className={`h-auto w-full shrink-0 select-none ${leaf.flip}`}
            />
          </span>
        ))}

        {/* Dấu son: nằm im, cửa mở và chữ hiện xong thì nó mới lao thẳng về
            phía người xem. */}
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
