import Image from "next/image";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TropicalReveal } from "@/components/ui/TropicalReveal";
import { couple, design } from "@/content/client";
import { background } from "@/lib/assets";

/**
 * Trang bìa đầu tiên: cặp đôi (nền trong suốt) đứng trên giấy rượu vang, nhẫn
 * lấp lánh theo chu kỳ. Nguồn hiệu ứng là public/ring-shimmer.html — phần CSS
 * nằm ở `.ring-motion` trong globals.css; ảnh và SVG dùng chung hệ toạ độ
 * 1254 × 1254 nên luôn phải scale cùng nhau. Chỉ lớp SVG chuyển động.
 *
 * Đây cũng là chỗ của màn mở thiệp: <TropicalReveal> đóng thì tán lá che kín
 * và tờ giấy "Hi :)" nằm giữa; bấm "Spill the tea" thì lá mở ra để lộ trang
 * này. Vì vậy cặp đôi và tên gắn `data-hero` — chúng chờ cú mở thiệp chứ
 * không chờ cuộn. Nền giấy lấy từ `design.cover` (tông `wine` + paper-wine).
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
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center">
        {/* Thứ nằm dưới tán lá, lộ ra khi cảnh mở: giấy rượu vang của section. */}
        <TropicalReveal
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

        <div className="relative z-20 flex w-full flex-col items-center gap-stack py-section">
          <div
            data-reveal
            data-hero
            className="ring-motion w-full max-w-[min(34rem,62svh,92vw)]"
          >
            <Image
              src="/coupleupdated.png"
              alt={`${couple.groom} và ${couple.bride} hôn nhau qua khung bàn tay đeo nhẫn`}
              width={1254}
              height={1254}
              sizes="(max-width: 40rem) 92vw, 34rem"
              priority
            />
            <svg
              className="ring-effects"
              viewBox="0 0 1254 1254"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath
                  id="weddingRingStoneClip"
                  clipPathUnits="userSpaceOnUse"
                >
                  <path d="M793 365 C771 375 714 403 685 444 C665 473 680 504 711 513 C745 524 782 505 803 474 C826 438 820 398 793 365Z" />
                  <path d="M840 425 C874 419 906 435 916 465 C928 499 909 531 879 540 C845 552 812 533 801 503 C788 468 807 434 840 425Z" />
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
            </svg>
          </div>

          <h1
            id="cover-title"
            data-reveal
            data-hero
            className="type-title container-site flex items-baseline justify-center gap-tight text-center text-tone-title"
          >
            <span>{couple.groom}</span>
            <span className="text-tone-accent">&amp;</span>
            <span>{couple.bride}</span>
          </h1>
        </div>
      </div>
    </SectionWrapper>
  );
}
