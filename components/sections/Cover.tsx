import Image from "next/image";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TropicalOpening } from "@/components/ui/TropicalOpening";
import { couple, cover, design, hero } from "@/content/client";
import { background } from "@/lib/assets";

/**
 * Trang bìa đầu tiên: cặp đôi (nền trong suốt) đứng trên giấy ô liu, nhẫn lấp
 * lánh theo chu kỳ. Nguồn hiệu ứng là public/ring-shimmer.html — phần CSS nằm
 * ở `.ring-motion` trong globals.css; ảnh và SVG dùng chung hệ toạ độ
 * 941 × 1339 (ảnh đã cắt phần trong suốt ở đáy) nên luôn phải scale cùng
 * nhau. Chỉ lớp SVG chuyển động. Khối hiệu ứng được vẽ theo toạ độ của ảnh cũ
 * (1254 × 1254) rồi đặt vào `<g transform>` để khớp viên đá của ảnh này.
 *
 * Đây cũng là chỗ của màn mở thiệp: <TropicalOpening> đóng thì tán lá che kín
 * và tờ giấy "Hi :)" nằm giữa; bấm "Spill the tea" thì lá mở ra để lộ trang
 * này. Vì vậy cặp đôi và tên gắn `data-hero` — chúng chờ cú mở thiệp chứ
 * không chờ cuộn. Nền giấy lấy từ `design.cover` (tông `olive` + paper-olive).
 */
export function Cover() {
  const paper = background(design.cover.background);

  return (
    <SectionWrapper
      section="cover"
      flush
      width="bleed"
      labelledBy="cover-title"
    >
      <div className="relative flex min-h-[100svh] flex-col items-center overflow-clip">
        {/* Thứ nằm dưới tán lá, lộ ra khi cảnh mở: giấy ô liu của section. */}
        <TropicalOpening
          backdrop={
            <div aria-hidden className="absolute inset-0 bg-tone-bg">
              {paper ? (
                <Image
                  src={paper.src}
                  alt=""
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              ) : null}
            </div>
          }
        />

        <div className="relative z-20 flex w-full flex-1 flex-col items-center">
          {/* Tranh (941 × 1339) bị cắt phẳng ở mép trái, phải — nên nó luôn phải
              rộng bằng hoặc hơn màn, bám lề trái (lùi 3.5% để cặp đôi xích sang
              trái, chỉ nhích vào móng tay ở mép; mặt chú rể không bị cắt). `--art-w` là bề ngang tranh, dùng chung cho khung và cho cỡ
              chữ đặt trên tranh (type-art-*). 130vw: bên phải cắt ~23% (ngón út
              và vạt váy, vốn đã cắt phẳng) nhưng vẫn đủ nhẫn và chữ "YES".
              Tranh được đẩy xuống `-0.2 × bề ngang` (≈ 14% chiều cao: chân và
              gấu váy tràn khỏi đáy, section clip) để đầu tranh và khoảng khuyết
              bên trái bàn tay rộng ra cho chữ. Trần theo chiều cao giữ ≥ 1rem
              phía trên ngón tay; sàn 104vw (= 100vw cộng phần lùi trái) để không lộ mép tranh. Từ `md` trở
              lên tranh co lại và đứng giữa như một tấm thiệp. */}
          <div
            data-reveal
            data-hero
            className="ring-motion mt-auto mb-[calc(var(--art-w)*-0.2)] aspect-[941/1339] w-[var(--art-w)] shrink-0 self-start max-md:ml-[calc(var(--art-w)*-0.035)] [--art-w:max(104vw,min(130vw,calc((100svh-1rem)*0.818)))] md:self-center md:[--art-w:min(100vw,58svh)]"
          >
            <Image
              src="/couple-cover.png"
              alt={`${couple.groom} và ${couple.bride} hôn nhau qua khung bàn tay đeo nhẫn`}
              width={941}
              height={1339}
              /* ≤ 128vw: deviceSizes tối đa 828, mà 640 × tỉ lệ phải ≤ 828. */
              sizes="(max-width: 40rem) 128vw, 58svh"
              priority
            />
            <svg
              className="ring-effects"
              viewBox="0 0 941 1339"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath
                  id="weddingRingStoneClip"
                  clipPathUnits="userSpaceOnUse"
                >
                  <path d="M686 431 L717 400 L760 380 L799 376 L816 400 L814 431 L808 461 L799 496 L777 513 L747 515 L717 504 L695 487 L682 461Z" />
                  <path d="M821 428 L851 426 L886 428 L912 445 L922 474 L918 504 L905 529 L877 541 L847 539 L821 526 L803 504 L809 474 L814 444Z" />
                </clipPath>
                <linearGradient
                  id="weddingRingSweep"
                  x1="0"
                  x2="1"
                  y1="0"
                  y2="0"
                >
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset=".18" stopColor="#ffe8bb" stopOpacity=".12" />
                  <stop offset=".37" stopColor="#fff9e8" stopOpacity=".58" />
                  <stop offset=".5" stopColor="#fff" stopOpacity="1" />
                  <stop offset=".63" stopColor="#fff" stopOpacity=".58" />
                  <stop offset=".8" stopColor="#dcf1ff" stopOpacity=".08" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="weddingRingHalo">
                  <stop offset="0" stopColor="#fff" stopOpacity=".8" />
                  <stop offset=".22" stopColor="#fff8dc" stopOpacity=".4" />
                  <stop offset="1" stopColor="#fff5d5" stopOpacity="0" />
                </radialGradient>
                <g id="weddingRingStar">
                  <circle r="31" fill="url(#weddingRingHalo)" />
                  <path
                    d="M0-28 3.3-4 24 0 3.3 4 0 28-3.3 4-24 0-3.3-4Z"
                    fill="#fffef4"
                  />
                  <path
                    d="M-13-13 0-2 13-13 2 0 13 13 0 2-13 13-2 0Z"
                    fill="#fff"
                    opacity=".65"
                  />
                  <circle r="3.5" fill="#fff" />
                </g>

                <radialGradient id="weddingRingWideGlow">
                  <stop offset="0" stopColor="#fff" stopOpacity=".95" />
                  <stop offset=".18" stopColor="#fff8d6" stopOpacity=".72" />
                  <stop offset=".45" stopColor="#ffecc6" stopOpacity=".26" />
                  <stop offset="1" stopColor="#fff4d7" stopOpacity="0" />
                </radialGradient>
                <filter
                  id="weddingRingSoftTrail"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feGaussianBlur stdDeviation="5" />
                </filter>
                <g id="weddingRingMegaStar">
                  <path
                    d="M0-102 8-13 87 0 8 13 0 102-8 13-87 0-8-13Z"
                    fill="#fffdf2"
                  />
                  <path
                    d="M-56-56-6-12 0-40 6-12 56-56 12-6 40 0 12 6 56 56 6 12 0 40-6 12-56 56-12 6-40 0-12-6Z"
                    fill="#fff"
                    opacity=".82"
                  />
                  <circle r="10" fill="#fff" />
                </g>
              </defs>
              <g transform="matrix(.77 0 0 .77 -25 -14.7)">
              <ellipse
                className="fx warm-aura"
                cx="807"
                cy="447"
                rx="185"
                ry="170"
                fill="url(#weddingRingWideGlow)"
              />
              <g clipPath="url(#weddingRingStoneClip)">
                <g className="fx light-sweep">
                  <rect
                    x="590"
                    y="270"
                    width="225"
                    height="360"
                    transform="rotate(16 702 450)"
                    fill="url(#weddingRingSweep)"
                  />
                </g>
                <path
                  className="fx facet"
                  d="M713 442 785 384 766 464Z"
                  fill="#fff7dc"
                />
                <path
                  className="fx facet facet-b"
                  d="M744 475 807 437 783 495Z"
                  fill="#ffe5f5"
                />
                <path
                  className="fx facet facet-c"
                  d="M822 450 885 434 861 484 907 500 850 529Z"
                  fill="#edf7ff"
                />
              </g>

              <g className="fx orbit-phase">
                <circle
                  className="orbit-trail"
                  cx="800"
                  cy="450"
                  r="156"
                  fill="none"
                  stroke="#ffe9af"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="155 845"
                  pathLength="1000"
                  filter="url(#weddingRingSoftTrail)"
                  opacity=".7"
                />
                <circle
                  className="orbit-trail"
                  cx="800"
                  cy="450"
                  r="156"
                  fill="none"
                  stroke="#fffdf4"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="102 898"
                  pathLength="1000"
                />
                <circle
                  className="orbit-trail orbit-trail-b"
                  cx="800"
                  cy="450"
                  r="146"
                  fill="none"
                  stroke="#fff3c9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="42 958"
                  pathLength="1000"
                  opacity=".65"
                />
                <g className="orbit-comet">
                  <g transform="translate(956 450) scale(.83)">
                    <use href="#weddingRingStar" />
                  </g>
                </g>
              </g>
              <g transform="translate(826 420)">
                <g className="drama-scale">
                  <g className="fx burst-halo">
                    <circle r="123" fill="url(#weddingRingWideGlow)" />
                  </g>
                  <g className="fx echo-ring">
                    <circle
                      r="88"
                      fill="none"
                      stroke="#fff6dc"
                      strokeWidth="2"
                      opacity=".75"
                    />
                  </g>
                  <g className="fx big-sparkle">
                    <use href="#weddingRingMegaStar" />
                  </g>
                </g>
              </g>
              <g transform="translate(683 474)">
                <g className="fx satellite">
                  <use href="#weddingRingStar" />
                </g>
              </g>
              <g transform="translate(917 512) scale(1.15)">
                <g className="fx satellite satellite-b">
                  <use href="#weddingRingStar" />
                </g>
              </g>
              <g transform="translate(783 349) scale(.75)">
                <g className="fx satellite satellite-c">
                  <use href="#weddingRingStar" />
                </g>
              </g>
            </g>
            </svg>

            {/* Tên và lời mời nằm trọn trong khoảng khuyết bên trái bàn tay
                (≈ 4%–40% bề ngang, từ mép trên tranh xuống vòm tay ≈ 34%).
                Chữ co theo `--art-w` nên luôn lọt. Khối được canh giữa dải
                trống phía trên tranh cộng khoảng khuyết (`--copy-top`), và
                không bao giờ tụt thấp hơn vòm tay. */}
            <div
              className="absolute left-[7.5%] top-[var(--copy-top)] md:left-[4%] flex -translate-y-1/2 flex-col gap-stack [--copy-top:min(calc((0.34*var(--art-w)_-_(100svh_-_1.223*var(--art-w)))/2),calc(0.185*var(--art-w)))]"
            >
              <h1
                id="cover-title"
                className="flex flex-col font-script type-art-name text-tone-title"
              >
                <span>{couple.groom}</span>
                <span className="flex items-center gap-[0.2em]">
                  <span className="tag-pill -rotate-6 font-script text-[0.65em]">
                    {cover.and}
                  </span>
                  <span>{couple.bride}</span>
                </span>
              </h1>
              <p className="type-art-body whitespace-pre text-tone-fg">
                {cover.invitation}
              </p>
            </div>

            {/* "she said YES" xếp hai dòng, cưỡi trên đường viền váy bên phải
                chiếc vòng — chữ hẹp để không bị mép phải của màn cắt. Neo theo
                đáy chữ (`bottom`) nên xuống dòng không làm lệch khỏi mép váy. */}
            <p className="absolute bottom-[41.2%] left-[63.8%] w-[12%] -rotate-3 type-art-note text-tone-title">
              {cover.yes}
            </p>

            {/* Dòng mời cuộn nằm trên vạt váy kem — chữ mang màu nền section. */}
            <p className="absolute left-[50%] top-[76%] -translate-x-1/2 whitespace-nowrap text-eyebrow uppercase text-tone-bg">
              {hero.scrollHint} ↓
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
