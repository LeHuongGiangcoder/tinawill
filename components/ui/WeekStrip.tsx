import { Heading } from "@/components/ui/Heading";

/**
 * Một tuần quanh ngày cưới, ngày cưới được khoanh trái tim vẽ tay:
 *
 *          March 2027
 *   wed thu fri  sat  sun mon tue
 *    24  25  26 ♡27♡  28  29  30
 *
 * Mọi thứ tính từ một chuỗi ISO (`ceremony.startISO`) — đổi ngày trong
 * client.ts là dải tự dựng lại, không có số nào đặt tay. Chỉ đọc phần ngày
 * (YYYY-MM-DD) và tính theo UTC để máy khách ở múi giờ khác không lệch sang
 * hôm trước/hôm sau.
 *
 * Màu đi theo tông của section: số `text-tone-fg`, thứ `text-tone-muted`,
 * ngày cưới và trái tim `text-tone-button` — cùng màu nút của section, nên
 * trái tim đi cặp với nút "Add calendar" ngay dưới.
 */

const DAY = 24 * 60 * 60 * 1000;

export function WeekStrip({
  iso,
  around = 3,
  locale = "en-US",
}: {
  /** Ngày cần khoanh — chỉ phần YYYY-MM-DD được dùng. */
  iso: string;
  /** Số ngày hai bên ngày khoanh. 3 = một tuần. */
  around?: number;
  locale?: string;
}) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const fmt = (opts: Intl.DateTimeFormatOptions, t: number) =>
    new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...opts }).format(t);

  const days = Array.from({ length: around * 2 + 1 }, (_, i) => {
    const t = target + (i - around) * DAY;
    return {
      t,
      weekday: fmt({ weekday: "short" }, t).toLowerCase(),
      day: new Date(t).getUTCDate(),
      chosen: i === around,
    };
  });

  return (
    <div className="flex w-full flex-col items-center gap-block">
      {/* Cùng bậc với "Pick your passport" của trang Visa — tiêu đề một khối. */}
      <Heading level="h3" as="p">
        {fmt({ month: "long", year: "numeric" }, target)}
      </Heading>

      {/* Cột ngày cưới rộng hơn để trái tim có chỗ, không đè chữ hai ngày bên cạnh. */}
      <ol
        className="grid w-full text-center"
        style={{
          gridTemplateColumns: `repeat(${around}, 1fr) 1.7fr repeat(${around}, 1fr)`,
        }}
      >
        {days.map(({ t, weekday, day, chosen }) => (
          <li
            key={t}
            className={`relative flex flex-col items-center ${chosen ? "text-tone-button" : "text-tone-fg"}`}
          >
            <span
              className={`font-display text-note lowercase ${chosen ? "" : "text-tone-muted"}`}
            >
              {weekday}
            </span>
            <span className="font-display text-h2 lining-nums tabular-nums">
              {day}
            </span>

            {chosen ? <Heart /> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Trái tim vẽ tay như nét bút màu: hai nửa tim là hai nét riêng bắt chéo nhau
 * ở mũi (mũi thò xuống dưới số), khe trên có một vòng xoắn nhỏ, và mép nét
 * hơi sần nhờ bộ lọc nhiễu — trông như sáp màu chứ không như đường vector.
 */
function Heart() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 120"
      className="pointer-events-none absolute left-1/2 top-0 h-auto w-[92%] -translate-x-1/2 -translate-y-[9%] overflow-visible"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <filter
          id="week-strip-crayon"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="7"
          />
          <feDisplacementMap in="SourceGraphic" scale="2.2" />
        </filter>
      </defs>
      <g filter="url(#week-strip-crayon)" transform="scale(1 0.86)">
        {/* Nửa trái: từ khe trên vòng qua thuỳ trái, xuống quá mũi một chút. */}
        <path
          vectorEffect="non-scaling-stroke"
          d="M51 30 C47 14 35 6 23 8 C9 11 1 26 3 48 C5 76 30 102 52 136"
        />
        {/* Nửa phải: bắt đầu lệch mũi để hai nét chéo nhau, lên thuỳ phải rồi
            quay về khe, kết bằng vòng xoắn nhỏ. */}
        <path
          vectorEffect="non-scaling-stroke"
          d="M45 135 C64 104 94 78 97 48 C99 26 96 14 84 10 C72 5 58 10 52 28 C50 22 46 21 47 26 C48 29 51 30 53 26"
        />
      </g>
    </svg>
  );
}
