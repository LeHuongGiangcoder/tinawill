import { Drifter, Hung } from "@/components/ui/Float";
import { Eyebrow, SectionTitle, Subhead } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { loveStory } from "@/content/client";

/**
 * "Our story" — một tờ giấy lượn sóng đặt trên nền lá, dưới một dải đèn lồng.
 *
 * Đèn treo thành một chùm sát nhau phía trên giấy, như chùm đèn Hội An: dây
 * dài ngắn khác nhau, thân đèn chồng lên nhau, đèn khai sau nằm đè lên đèn
 * khai trước (thứ tự trong mảng `lanterns`). Đèn nhỏ nằm sau giấy cho có chiều sâu.
 *
 * Từ dưới lên, các lớp xếp như sau (z-index trong `.page-frame`):
 *
 *   0   đèn lồng `back`  — nhỏ, treo cao ở đỉnh trang, nằm SAU giấy
 *   10  tờ giấy          — một file, cắt ba mảnh nên cao bao nhiêu cũng được
 *       └ 0   đèn hoa đăng trôi dưới chân giấy, nằm sau chữ
 *       └ 10  chữ
 *   20  đèn lồng `front` — to, treo dọc hai mép, đè lên mép giấy
 *
 * Giấy chạy bằng `.page-frame` trong app/globals.css; đèn là `Hung` và
 * `Drifter` trong components/ui/Float.tsx. Vị trí từng đèn nằm ở `loveStory`
 * trong content/client.ts — section này chỉ xếp lớp.
 *
 * Đổi lời là sửa `loveStory` trong content/client.ts — thêm một đoạn thì
 * trang tự cao lên, khung co theo, không phải tính lại toạ độ gì.
 */

const PAPER = "/love-story";

/**
 * Dải nền xanh phía trên giấy, cqw — nơi chùm đèn treo. Đèn `front` treo thấp
 * hơn mức này nên chóp tua đè lên mép giấy; đèn giữa trang thì dừng trước dòng
 * chữ đầu, đèn hai mép được xuống thấp hơn (xem `hang` trong content/client.ts).
 */
const CURTAIN = 40;

export function LoveStory() {
  const { eyebrow, title, subtitle, paragraphs, closing, lanterns, lotuses } = loveStory;

  return (
    /*
      `flush` + `width="bleed"`: tờ giấy chạm hai mép màn trên điện thoại.
      Nền section giữ màu lá (tông `leaf`), nên phần thừa hai bên trên màn
      rộng hoà làm một với nền.
    */
    <SectionWrapper section="loveStory" flush width="bleed" labelledBy="love-story-title">
      <div className="page-frame">
        {/* Đèn sau giấy. Lớp bọc cắt dây ở mép trên, `overflow-y-clip` để đèn
            vẫn tràn được ra hai bên. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-y-clip">
          {lanterns
            .filter((l) => l.layer === "back")
            .map((l) => (
              <Hung key={`${l.name}-${l.left}`} {...l} />
            ))}
        </div>

        {/*
          `data-tone="light"` cho cả trang: mặt giấy sáng hơn nền section, nên
          chữ, gạch và chữ phụ bên trong lấy bảng màu của nền sáng mà không
          phải viết màu cứng ở đây.
        */}
        <div
          data-tone="light"
          className="page-frame-body relative z-10 text-tone-fg"
          style={
            {
              "--paper-top": `url(${PAPER}/paper-top.webp)`,
              "--paper-mid": `url(${PAPER}/paper-mid.webp)`,
              "--paper-bottom": `url(${PAPER}/paper-bottom.webp)`,
              marginTop: `${CURTAIN}cqw`,
            } as React.CSSProperties
          }
        >
          <div aria-hidden className="page-frame-foot">
            {lotuses.map((l) => (
              <Drifter key={l.name} {...l} />
            ))}
          </div>

          <div className="relative z-10 flex flex-col gap-block">
            {/*
              Đúng ba bậc của SectionHead — eyebrow, tiêu đề viết tay, dòng dẫn
              in nghiêng — nhưng dựng tay chứ không gọi SectionHead: khối ở đây
              nằm trong trang giấy, và `gap-block` của khung giấy đã là đúng
              khoảng cách giữa đầu trang và đoạn đầu tiên.
            */}
            <div className="page-frame-lead flex flex-col items-center gap-tight text-center">
              <Eyebrow data-reveal>{eyebrow}</Eyebrow>
              <SectionTitle id="love-story-title" data-reveal data-reveal-delay="90">
                {title}
              </SectionTitle>
              <Subhead data-reveal data-reveal-delay="150" className="max-w-prose">
                {subtitle}
              </Subhead>
            </div>

            <div className="flex flex-col gap-stack">
              {paragraphs.map((text, i) => (
                /* <p> trần: chữ thân bài của site là font body ở bậc `base`,
                   căn trái — giống Travel, Gifts, Dresscode. */
                <p key={text.slice(0, 24)} data-reveal data-reveal-delay={(i + 1) * 60}>
                  {text}
                </p>
              ))}

              {closing ? (
                <p
                  data-reveal
                  data-reveal-delay={(paragraphs.length + 1) * 60}
                  className="text-small italic text-tone-muted"
                >
                  {closing}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Đèn trước giấy. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-y-clip">
          {lanterns
            .filter((l) => l.layer === "front")
            .map((l) => (
              <Hung key={`${l.name}-${l.left}`} {...l} />
            ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
