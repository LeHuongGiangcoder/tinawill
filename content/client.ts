import type {
  BackgroundName,
  DividerName,
  ElementName,
  TextureName,
} from "@/content/assets";
import type { Tone } from "@/content/theme";

/**
 * NỘI DUNG CỦA KHÁCH — Tina & Will, 27.03.2027, NHAAN Resort & Spa Hoi An.
 *
 * Site tiếng Anh: khách bay từ Âu, Mỹ, Ấn, Đông Nam Á và Hong Kong sang, nên
 * mọi chữ trên trang viết bằng tiếng Anh.
 *
 * Ngày giờ luôn viết dạng ISO kèm offset Việt Nam (+07:00) để lịch và đồng hồ
 * đếm ngược không lệch múi giờ.
 *
 * ⚠️ Còn chờ khách gửi: ảnh cặp đôi (public/images còn ảnh mẫu), nhạc nền,
 * link Maps ghim sẵn của resort, và thông tin chuyển khoản cho honeymoon fund.
 */

/* --------------------------------------------------------------- SECTIONS */

/** Mọi section có trong khung nền. */
export type SectionId =
  | "intro"
  | "hero"
  | "time"
  | "loveStory"
  | "gallery"
  | "weddingInfo"
  | "venue"
  | "visa"
  | "travel"
  | "agenda"
  | "dresscode"
  | "rsvp"
  | "gifts"
  | "thankYou";

/**
 * Thứ tự hiển thị. Bỏ một section khỏi mảng này là nó không render nữa —
 * không cần xoá code. Đổi chỗ hai dòng là đổi thứ tự trên trang.
 *
 * `gallery` tạm để ngoài: chưa có ảnh cưới của Tina & Will, thêm lại một dòng
 * là album hiện ngay.
 *
 * `weddingInfo` cũng để ngoài: ngày giờ đã nằm trên trang Save the date, địa
 * điểm nằm trên trang Venue, nên nó chỉ nhắc lại cả hai. Thêm lại một dòng là
 * nó hiện ngay cùng khối tên gia đình hai bên.
 */
export const sections: SectionId[] = [
  "intro",
  "hero",
  "time",
  "venue",
  "visa",
  "travel",
  "loveStory",
  "agenda",
  "dresscode",
  "rsvp",
  "gifts",
  "thankYou",
];

/* ----------------------------------------------------------- MẶT NHÌN */

/**
 * Một hoạ tiết rời đặt lên nền section.
 *
 * `at` là chuỗi utility Tailwind định vị + bề rộng, ví dụ
 * `"top-[6%] -left-[4%] w-[28%]"`. Dùng % thay vì rem để hoạ tiết co theo
 * section trên điện thoại; `hideOnMobile` cho những cái màn hẹp không còn chỗ.
 */
export type DecorPlacement = {
  name: ElementName;
  at: string;
  rotate?: number;
  /**
   * Chỉ đặt khi người dùng yêu cầu. Mặc định 1 — xem "Ba luật thiết kế" trong
   * CLAUDE.md: không làm mờ hoạ tiết cho chìm vào nền.
   */
  opacity?: number;
  /** Lắc lư nhẹ, cho thứ trông như đang treo hoặc rung rinh. */
  sway?: boolean;
  /** Trôi chậm hơn trang bao nhiêu % khi cuộn. */
  parallax?: number;
  hideOnMobile?: boolean;
};

export type SectionDesign = {
  /** id trong HTML — cũng là cái dùng cho link neo `#...`. */
  anchor: string;
  /** Bảng màu, xem `tones` trong content/theme.ts. */
  tone: Tone;
  /**
   * Ảnh nền full-bleed. Nhận hai kiểu:
   *   • tên trong `assets.backgrounds` — ảnh của design system, ở brand/
   *   • đường dẫn bắt đầu bằng "/" — ảnh của chính cặp đôi, ở public/images
   * null = chỉ dùng màu nền của tông.
   */
  background?: BackgroundName | `/${string}` | null;
  /** Độ mờ của lớp phủ trên ảnh nền, 0–1. Cao hơn = chữ dễ đọc hơn. */
  overlay?: number;
  /** Vân giấy lặp kín nền. */
  texture?: TextureName | null;
  /**
   * Đổi `texture` từ vân giấy sang dải dọc: ô lặp rộng đúng bấy nhiêu, cao
   * hết section, và chỉ lặp theo chiều ngang.
   *
   * Vân giấy thì lặp cả hai chiều ở một cỡ hạt cố định; một dải sọc dọc thì
   * không — nó phải giữ đúng bề rộng vạch và kéo dài hết chiều cao, nếu không
   * sẽ thấy đường nối ngang ở mỗi lần lặp. Nhận bất kỳ giá trị CSS nào, nên
   * dùng clamp() để vạch co theo máy hẹp.
   */
  textureWidth?: string;
  /** Dải ngăn cưỡi lên đường nối với section phía trên. */
  divider?: DividerName | null;
  decor?: DecorPlacement[];
};

/**
 * Mặt nhìn của từng section — tông màu, nền, hoạ tiết.
 *
 * Tách khỏi file section để đổi diện mạo là sửa nội dung chứ không sửa code.
 * Nhịp tông ở đây: sáng → tối → sáng, để hai section chữ dài (travel, agenda)
 * không nằm liền nhau cùng một màu nền.
 */
export const design: Record<SectionId, SectionDesign> = {
  /* Intro và hero dùng chung một nền: khu vườn nhiều lớp trong
     components/ui/GardenStage.tsx, chứ không phải ảnh nền của SectionWrapper.
     Vì thế cả hai đều để `background` trống. */
  intro: { anchor: "intro", tone: "light" },
  hero: { anchor: "hero", tone: "dark" },
  /* Mọi section giấy màu bên dưới đều `overlay: 0`: màu trong `tones` đã lấy
     đúng màu trung bình của file giấy, nên không cần lớp phủ nào cho chữ đọc
     được — xem ghi chú ở `palette.wine` trong content/theme.ts. */
  weddingInfo: {
    anchor: "wedding",
    tone: "wine",
    background: "paper-wine",
    overlay: 0,
  },
  /* Venue là một cảnh ghép nhiều lớp như intro/hero, không phải section chữ.
     Nền giấy xanh ô liu đi qua `background` để nó phủ kín mọi khổ màn; bốn lớp
     tranh còn lại nằm trong khung 9/16 của chính section (components/sections/
     Venue.tsx). `overlay: 0` vì nền này đã là màu phẳng, không cần lớp phủ cho
     chữ đọc được — chữ kem trên ô liu đạt 6.1:1. */
  /* Save the date là cảnh ghép hai lớp như Venue: giấy rượu vang phủ kín
     section, còn lá cây và hai ghế tắm nắng nằm trong khung 9/16 của chính
     section (components/sections/Time.tsx). */
  time: { anchor: "time", tone: "wineBeige", background: "paper-wine", overlay: 0 },
  venue: {
    anchor: "venue",
    tone: "olive",
    background: "/venue/backdrop.webp",
    overlay: 0,
  },
  /* Trang "Our story" là một tờ giấy phủ kín section — nền section tô đúng
     màu lá của khung, xem tông `leaf` trong content/theme.ts. */
  loveStory: { anchor: "love-story", tone: "leaf" },
  /* Hai trang hướng dẫn đứng liền nhau nên phải khác giấy, nếu không mắt đọc
     ra một section dài thay vì hai. Đỏ son rồi tới cam: cùng họ ấm với giấy
     ô liu của Venue phía trên, nhưng mỗi trang một sắc riêng. */
  /* Dải sọc đỏ–kem khách gửi, lặp theo chiều ngang. Chữ không nằm thẳng lên
     đó mà nằm trên một tờ giấy beige (xem components/sections/Visa.tsx).
     Mỗi ô lặp là MỘT cặp vạch, nên ô 3.75rem cho ra vạch khoảng 30px — đúng
     nhịp vạch ban đầu của bản khách gửi.

     Số cố định chứ không phải clamp theo màn, cùng lý do với vân giấy trong
     SectionWrapper: vạch sọc phải giữ nguyên bề rộng ở mọi khổ màn, co giãn
     theo màn thì trên desktop nó phình thành mái hiên rạp xiếc. `round` vẫn
     co ô chút đỉnh cho vừa chẵn số lần, nên hai mép màn luôn là nửa vạch
     màu. Vì sao ô chỉ một nhịp: xem scripts/visa-assets.mjs. */
  visa: {
    anchor: "visa",
    tone: "stripe",
    texture: "stripe-vermilion",
    textureWidth: "3.75rem",
  },
  travel: {
    anchor: "travel",
    tone: "mango",
    background: "paper-mango",
    overlay: 0,
  },
  agenda: {
    anchor: "agenda",
    tone: "wine",
    background: "paper-wine",
    overlay: 0,
  },
  dresscode: {
    anchor: "dresscode",
    tone: "mango",
    background: "paper-mango",
    overlay: 0,
  },
  gallery: { anchor: "gallery", tone: "light" },
  /* Dải sọc xanh ô liu–kem, cùng bộ với tấm sọc đỏ của trang Visa nhưng khác
     màu nên hai trang không lẫn vào nhau. Chữ nằm trên tờ giấy beige, viền
     quanh là đường sóng cam. */
  rsvp: {
    anchor: "rsvp",
    tone: "stripeOlive",
    texture: "stripe-olive",
    textureWidth: "3.75rem",
  },
  gifts: {
    anchor: "gifts",
    tone: "vermilion",
    background: "paper-vermilion",
    overlay: 0,
  },
  thankYou: {
    anchor: "thank-you",
    tone: "wine",
    background: "paper-wine",
    overlay: 0,
  },
};

/* ------------------------------------------------------------------ COUPLE */

export const couple = {
  /** Tên hiển thị lớn ở hero và màn mở thiệp. Site gọi "Tina & Will". */
  bride: "Tina",
  groom: "Will",
  /** Tên đầy đủ — khách chưa gửi, để trống thì phần thông tin tự ẩn. */
  brideFull: "",
  groomFull: "",
  hashtag: "",
};

/**
 * Bố mẹ hai bên. Cặp này không in tên gia đình trên thiệp — để mảng rỗng thì
 * khối gia đình trong section Wedding tự ẩn.
 */
export const families: {
  side: string;
  people: { role: string; name: string }[];
  home?: string;
}[] = [];

/* -------------------------------------------------------------- NGÀY & GIỜ */

export const ceremony = {
  /** Lễ bên bờ sông. Link "Add to calendar" tính từ hai mốc này. */
  startISO: "2027-03-27T16:00:00+07:00",
  endISO: "2027-03-27T22:30:00+07:00",
  weekday: "Saturday",
  dateShort: "March 27, 2027",
  timeLabel: "16:00",
  /** Ngày âm — site tiếng Anh không dùng. */
  lunar: "",
};

export const venue = {
  name: "NHAAN Resort & Spa Hoi An",
  hall: "Tapestry Collection by Hilton",
  address: "Vong Nhi Village, Hoi An Dong Ward, Da Nang City, Vietnam",
  /** TODO: thay bằng link Maps ghim sẵn khi khách gửi. */
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=NHAAN+Resort+%26+Spa+Hoi+An",
  mapLabel: "View on map",
  note: "A place whose name means home and peace.",
};

/* ------------------------------------------------------------------ INTRO */

export const intro = {
  /** Nhãn cho trình đọc màn hình — tấm giấy không in dòng này ra. */
  label: "Wedding invitation of Tina and Will",
  /** Dòng duy nhất trên tấm giấy giữa khu vườn. */
  note: "We are pleased to have you",
  /** Nút mở thiệp. Chính cú chạm này bật nhạc — xem ExperienceProvider. */
  cta: "Open invitation",
};

/* ------------------------------------------------------------------- HERO */

export const hero = {
  /** Lời mời nổi trên mặt nước, ngay trên tên hai người. */
  invitation: "With all our heart, we invite you to our wedding",
  scrollHint: "Scroll",
};

/* -------------------------------------------------------------- LOVE STORY */

export const loveStory = {
  /** Dòng nhỏ in hoa trên tiêu đề. */
  eyebrow: "How it started",
  /** Tiêu đề viết tay trên đầu trang giấy. */
  title: "Our story",
  /** Dòng dẫn in nghiêng ngay dưới tiêu đề. */
  subtitle: "An event, a conversation that ran till 3am, and one building.",
  /**
   * Chuyện tình kể liền một mạch trên MỘT trang giấy — mỗi phần tử là một
   * đoạn. Thêm hay bớt một đoạn thì trang tự cao lên hoặc thấp xuống, khung
   * giấy co theo (xem `.page-frame` trong app/globals.css).
   */
  paragraphs: [
    "The first time we talked was at an event. The event ended, everyone went home — and we still hadn't finished our conversation. So we took it to a little Chinese restaurant nearby and kept talking till 3am. When it was time to go home, Tina asked Will where he lived. Then we realized that we were living in the exact same building. We shared a Grab home that night.",
    "Then the universe got involved. Every single day for the next week, we kept running into each other — in the gym, at a cafe, at a different hour each day, without ever planning it. By day seven, it was hard to call it a coincidence.",
    "And the rest, as they say, is history.",
    "It wasn't always easy. Will's way of seeing the world is shaped by German culture — direct, structured, a bit dry they say. Tina's is shaped by American culture — expressive, spontaneous, always up to do more. We've had our share of cultural clashes (and a few very long talks about them). But every difference we worked through taught us something new about each other, and brought us closer.",
  ],
  /** Câu kết in nghiêng, đứng tách dưới cùng trang. Để trống thì không hiện. */
  closing:
    "Two people, two cultures, one building — and now, one life together.",
};

/* ---------------------------------------------------------------- GALLERY */

export const gallery = {
  eyebrow: "Album",
  title: "Our moments",
  subtitle: "A few of the photos we love most.",
  note: "Everything from the first trips together to the day we said yes.",
  /** Chữ gợi ý cho người xem biết dải ảnh kéo ngang được. */
  hint: "Swipe to see more",
  shots: [
    { src: "/images/gallery-01.jpg", alt: "Tina and Will" },
    { src: "/images/gallery-02.jpg", alt: "Tina and Will" },
    { src: "/images/gallery-03.jpg", alt: "Tina and Will" },
    { src: "/images/gallery-04.jpg", alt: "Tina and Will" },
    { src: "/images/gallery-05.jpg", alt: "Tina and Will" },
    { src: "/images/gallery-06.jpg", alt: "Tina and Will" },
  ],
};

/* ------------------------------------------------------------ WEDDING INFO */

export const weddingInfo = {
  eyebrow: "You're invited",
  title: "The Wedding",
  subtitle: "A weekend by the river in Hoi An",
  intro:
    "Join us for a weekend of love, food and celebration by the river in Hoi An. We can't think of a better way to begin our life together than surrounded by the people we love most.",
  saveTheDateLabel: "Save the date",
  venueLabel: "Venue",
  calendarLabel: "Add to calendar",
  photo: "/images/couple-05.jpg",
  photoAlt: "Tina and Will",
};

/* -------------------------------------------------------------- SAVE DATE */

/**
 * Trang "Save the date" — bản Canva khách vẽ, dựng lại thành cảnh ghép hai
 * lớp tranh (public/time) với chữ thật nằm giữa.
 *
 * Ngày, giờ và link lịch KHÔNG khai ở đây: chúng lấy từ `ceremony` phía trên
 * để trang này và thiệp mời không bao giờ lệch nhau.
 */
export const timeScene = {
  title: "Save the Date",
  intro:
    "Join us for a weekend of love, food and celebration by the river in Hoi An \u2014 at a place whose name means \u201chome\u201d and \u201cpeace.\u201d We can\u2019t think of a better way to begin our life together than surrounded by the people we love most.",
  calendarLabel: "Add calendar",
  /** Nhãn cho trình đọc màn hình: tranh là trang trí, aria-hidden hết. */
  sceneLabel: "Two cats napping on sun loungers in a tropical garden",
};

/* ------------------------------------------------------------------ VENUE */

/**
 * Trang "Our wedding venue" — bản Canva khách vẽ, dựng lại bằng năm lớp tranh
 * (public/venue) chồng lên nhau, chữ là chữ thật nằm trên bàn.
 *
 * Chỉ khai ở đây những chữ riêng của cảnh này; tên nơi tổ chức, tên khu và
 * link Maps vẫn lấy từ `venue` ở trên để hai chỗ không bao giờ lệch nhau.
 */
export const venueScene = {
  title: "Our wedding venue",
  /** Dòng thành phố trên tấm bàn — ngắn hơn `venue.address` cho vừa bố cục. */
  cityLine: "Da Nang City, Vietnam",
  mapLabel: "Check map",
  /** Nhãn cho trình đọc màn hình: tranh là trang trí, aria-hidden hết. */
  sceneLabel: "Two glasses raised over a table set for the wedding",
};

/* ----------------------------------------------------------------- TRAVEL */

/**
 * Hướng dẫn visa & đi lại. Mỗi khối là một câu hỏi khách hay hỏi; `kind`
 * quyết định cách render:
 *   text    — mấy đoạn văn
 *   bullets — gạch đầu dòng
 *   steps   — danh sách có số, dùng cho quy trình e-visa
 *
 *   topics  — một chồng khối gập: mỗi mục một từ khoá, bấm mới mở ra, và
 *             mở mục này thì mục kia gập lại. Dùng khi hai thẻ của ô cửa sổ
 *             cần cao xấp xỉ nhau — gập lại thì thẻ nào cũng chỉ còn một
 *             hàng từ khoá, chỉ một mục mở sẵn.
 *
 * `highlight` làm khối nổi lên như một thẻ.
 * `actions` thành nút ở cuối khối (hoặc cuối một mục của `topics`).
 */
export type GuideAction = { label: string; href: string };

/** Một mục gập của khối `topics`: từ khoá hiện sẵn, nội dung bấm mới thấy. */
export type GuideTopic = {
  label: string;
  body: string;
  actions?: GuideAction[];
};

export type TravelGroup =
  | {
      title: string;
      kind: "text" | "bullets" | "steps";
      lead?: string;
      items: string[];
      note?: string;
      highlight?: boolean;
      actions?: GuideAction[];
    }
  | {
      /** Không hiện — nhãn của thẻ đã nói rồi. Chỉ dùng làm khoá và tên nhóm gập. */
      title: string;
      kind: "topics";
      lead?: string;
      topics: GuideTopic[];
    };

/**
 * Một thẻ của trang hướng dẫn: nhãn trên nút, và mấy khối hướng dẫn bên dưới.
 */
export type GuideTab = {
  /** Khoá ổn định, dùng dựng id cho cặp nút ↔ nội dung. */
  id: string;
  label: string;
  groups: TravelGroup[];
};

/* -------------------------------------------------------------------- VISA */

/**
 * Một tuyến bay. Nhiều hộ chiếu dùng chung một tuyến — Ấn Độ và Maldives bay
 * y hệt nhau — nên tuyến khai riêng ở `flightRoutes` rồi hộ chiếu trỏ vào,
 * thay vì chép đôi và có ngày sửa một chỗ quên chỗ kia.
 */
export type FlightRoute = { lead: string; items: string[] };

const flightRoutes = {
  /** Bay thẳng tới Đà Nẵng: Đông Nam Á và Hồng Kông. */
  direct: {
    lead: "Direct to Da Nang (DAD) — around 2–3 hours.",
    items: [
      "Direct flights from most major hubs: Singapore, Bangkok, Kuala Lumpur and Hong Kong.",
    ],
  },
  /** Nối chuyến trong khu vực: Ấn Độ và Maldives. */
  asiaHub: {
    lead: "One stop, then straight on to Da Nang (DAD).",
    items: [
      "Connect via Ho Chi Minh City, Hanoi, Singapore, Kuala Lumpur or Bangkok.",
    ],
  },
  /** Nối chuyến từ Châu Âu, qua vùng Vịnh hoặc Đông Nam Á. */
  europe: {
    lead: "One stop, then straight on to Da Nang (DAD).",
    items: [
      "Connect via Singapore, Bangkok, Doha, Dubai or Istanbul.",
      "Or fly into Ho Chi Minh City / Hanoi and take a short domestic flight — about 1h20 — on to Da Nang.",
    ],
  },
  /** Nối chuyến vượt Thái Bình Dương: Mỹ. */
  pacific: {
    lead: "One stop, then straight on to Da Nang (DAD).",
    items: ["Connect via Seoul, Tokyo, Taipei, Hong Kong or Singapore."],
  },
} satisfies Record<string, FlightRoute>;

export type FlightRouteName = keyof typeof flightRoutes;

/** Một nhóm hộ chiếu: lá cờ trên nút, và phần hướng dẫn riêng của nhóm. */
export type VisaRegion = {
  id: string;
  /** Tên file trong brand/elements, bỏ đuôi — gõ sai là build đỏ. */
  flag: ElementName;
  label: string;
  /** Câu trả lời cho "tôi có cần visa không", in ngay dưới lá cờ. */
  verdict: string;
  /** Bật thì khối sáu bước xin e-visa hiện ra cho nhóm này. */
  needsEvisa: boolean;
  /** Thêm một câu chỉ đúng nhóm này mới cần đọc. */
  note?: string;
  route: FlightRouteName;
};

/**
 * Hướng dẫn visa và đường bay, xếp theo hộ chiếu.
 *
 * Trước đây đây là hai thẻ "Visa" và "Flights", mỗi thẻ liệt kê cả sáu quốc
 * tịch — ai cũng phải đọc lướt qua năm phần không liên quan tới mình để tìm
 * phần của mình, hai lần. Giờ khách chọn hộ chiếu một lần và chỉ thấy đúng
 * phần của họ: cần visa hay không, nếu cần thì sáu bước xin e-visa, và bay
 * đường nào.
 *
 * Phần nào ai cũng phải đọc thì nằm ngoài khối chọn: hạn hộ chiếu 6 tháng ở
 * câu dẫn, đường từ sân bay về resort ở `airport`.
 */
export const visa = {
  eyebrow: "Before you fly",
  title: "Visa Guide",
  subtitle: "Pick your passport — we'll show only the part that applies to you.",
  intro:
    "Whichever one it is, your passport must be valid for at least 6 months after you arrive.",
  /** Nhãn hàng cờ cho trình đọc màn hình. */
  regionsLabel: "Choose your passport",
  visaHeading: "Your visa",
  flightHeading: "Flying in",

  routes: flightRoutes,

  /**
   * Sáu bước xin e-visa — khai MỘT lần, bốn nhóm hộ chiếu cần e-visa cùng
   * dùng, nên bốn chỗ không bao giờ lệch nhau.
   */
  evisa: {
    title: "How to get your e-visa",
    items: [
      "Apply only on the official site: evisa.gov.vn — look-alike sites charge extra fees.",
      "The fee is USD 25 for single entry, paid by card.",
      "Apply at least 3–4 weeks before your flight.",
      "Check every detail carefully — the fee is non-refundable if there's a mistake.",
      "Choose Da Nang International Airport as your entry point.",
      "Print your approved e-visa and bring it with you.",
    ],
    action: { label: "Open evisa.gov.vn", href: "https://evisa.gov.vn" },
  },

  /** Ai cũng đọc phần này, nên nó đứng ngoài khối chọn hộ chiếu. */
  airport: {
    title: "From the airport",
    body: "The resort is about 40–45 minutes by car. Grab is easy and affordable — when booking a ride, just type in the name of the resort and it will show right up.",
  },

  regions: [
    {
      id: "europe",
      flag: "flag-eu",
      label: "Europe",
      verdict: "Visa-free, up to 45 days.",
      needsEvisa: false,
      route: "europe",
    },
    {
      id: "southeast-asia",
      flag: "flag-asean",
      label: "Southeast Asia",
      verdict: "Visa-free, up to 30 days.",
      needsEvisa: false,
      route: "direct",
    },
    {
      id: "hong-kong",
      flag: "flag-hongkong",
      label: "Hong Kong",
      verdict: "E-visa required.",
      note: "If you hold both an HKSAR and a BN(O) passport, apply and travel on your HKSAR passport.",
      needsEvisa: true,
      route: "direct",
    },
    {
      id: "india",
      flag: "flag-india",
      label: "India",
      verdict: "E-visa required.",
      needsEvisa: true,
      route: "asiaHub",
    },
    {
      id: "maldives",
      flag: "flag-maldives",
      label: "Maldives",
      verdict: "E-visa required.",
      needsEvisa: true,
      route: "asiaHub",
    },
    {
      id: "usa",
      flag: "flag-usa",
      label: "USA",
      verdict: "E-visa required.",
      needsEvisa: true,
      route: "pacific",
    },
  ] satisfies VisaRegion[],
};

/** Hướng dẫn tại chỗ — ở đâu, thời tiết thế nào, quanh đó có gì. */
export const travel = {
  eyebrow: "Once you're here",
  title: "Travel Guide",
  subtitle: "From the moment you land to the river in Hoi An.",
  intro:
    "Where to stay, what the weather is like, and the small things worth knowing before you pack.",
  tabsLabel: "Choose a topic",
  tabs: [
    {
      id: "stay",
      label: "Where to stay",
      groups: [
        {
          title: "stay",
          kind: "topics",
          // nbsp giữ biểu tượng đảo đi cùng chữ, không rơi một mình xuống dòng
          lead: "The wedding night is on\u00a0us.\u00a0🏝",
          topics: [
            {
              label: "Wedding night",
              body: "One night at NHAAN Resort & Spa Hoi An on Saturday, March 27 is covered for every guest — celebrate late, then simply walk back to your room.",
            },
            {
              label: "The whole weekend",
              body: "Join us for the Welcome Dinner on Friday and the Farewell Brunch on Sunday — Hoi An is well worth a few extra days.",
            },
            {
              label: "Extra nights",
              body: "Our wedding planner will book additional nights at the resort and take care of everything for you.",
              actions: [
                { label: "WhatsApp", href: "https://wa.me/84363059436" },
                { label: "Email", href: "mailto:teamhandsheart.planner@gmail.com" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "weather",
      label: "Weather & tips",
      groups: [
        {
          title: "tips",
          kind: "topics",
          topics: [
            {
              label: "Weather",
              body: "Late March is warm and mostly dry, around 24–29°C. Pack sunscreen, sunglasses and a light layer for the evening.",
            },
            {
              label: "Currency & payment",
              body: "Vietnamese Dong (VND). Cards work at the resort; carry some cash for markets and cafés.",
            },
            {
              label: "Getting around",
              body: "Grab is the go-to app for rides and food.",
            },
            {
              label: "Around Hoi An",
              body: "The Ancient Town is 5 km away — lanterns, amazing food, and the best tailors, leather goods and custom silver. An Bang Beach, the Marble Mountains and Da Nang are all close by.",
            },
          ],
        },
      ],
    },
  ] satisfies GuideTab[],
};

/* ----------------------------------------------------------------- AGENDA */

/**
 * Chương trình ba ngày. Mỗi ngày một khối, trong khối là trục thời gian.
 * Mục không có giờ (ví dụ "Daytime") vẫn hiện, chỉ là nhãn thay cho giờ.
 */
/**
 * Con tem đại diện cho một ngày — tên file trong public/agenda (bỏ đuôi), cắt
 * từ bản khách gửi bằng `node scripts/agenda-assets.mjs`. Gõ sai tên là build
 * đỏ chứ không âm thầm mất ảnh.
 */
export type AgendaStamp = "cocktail" | "sun" | "monstera";

export const agenda = {
  eyebrow: "The weekend",
  title: "Agenda",
  subtitle: "Three days, one celebration.",
  intro: "Exact times will be confirmed closer to the date.",
  /** Nhãn hàng nút chọn ngày, chỉ trình đọc màn hình nghe thấy. */
  daysLabel: "Choose a day",
  days: [
    {
      label: "Friday, March 26",
      stamp: "cocktail",
      title: "Welcome Evening",
      items: [
        {
          time: "Daytime",
          title: "Arrive & settle in",
          note: "Explore Hoi An at your own pace",
        },
        {
          time: "18:30",
          title: "Welcome Dinner",
          note: "A relaxed evening of drinks, Vietnamese food and catching up before the big day",
        },
      ],
    },
    {
      label: "Saturday, March 27",
      stamp: "sun",
      title: "Wedding Day",
      items: [
        {
          time: "14:00",
          title: "Check in",
          note: "Your room at NHAAN is ready",
        },
        { time: "15:30", title: "Guests gather", note: "" },
        { time: "16:00", title: "Ceremony by the river", note: "" },
        {
          time: "16:45",
          title: "Cocktail hour",
          note: "Photos at golden hour",
        },
        {
          time: "18:30",
          title: "Reception dinner",
          note: "Speeches & first dance",
        },
        {
          time: "21:30",
          title: "After party",
          note: "Bring your dancing shoes 💃",
        },
      ],
    },
    {
      label: "Sunday, March 28",
      stamp: "monstera",
      title: "Farewell Brunch",
      items: [
        {
          time: "10:00",
          title: "Farewell brunch",
          note: "A slow, sunny goodbye (and recovery)",
        },
        { time: "12:00", title: "Check-out", note: "" },
      ],
    },
  ] satisfies {
    label: string;
    stamp: AgendaStamp;
    title: string;
    items: { time: string; title: string; note: string }[];
  }[],
};

/* -------------------------------------------------------------- DRESSCODE */

export const dresscode = {
  eyebrow: "What to wear",
  title: "Dresscode",
  /** Dòng dẫn in nghiêng dưới tiêu đề — tên của bảng màu. */
  subtitle: "Jungle Glam 🌿",
  note: "Our celebration is set among coconut groves and riverside greenery — so we're bringing the jungle to the dance floor. Think lush, bold and warm, but still elegant. Mix the colours, match them, or go all in on one. Tropical prints, leafy patterns and earthy textures are very welcome.",
  /** Để mảng rỗng thì phần bảng màu tự ẩn. */
  swatches: [
    { name: "Burnt orange", hex: "#c2622e" },
    { name: "Papaya", hex: "#e08a3c" },
    { name: "Olive", hex: "#6f7a43" },
    { name: "Jungle green", hex: "#2b4030" },
    { name: "Red wine", hex: "#6e2639" },
    { name: "Deep plum", hex: "#4a2238" },
  ],
  /** Gợi ý cụ thể cho từng nhóm khách. */
  notes: [
    {
      label: "For him",
      body: "Linen or light suits in olive, rust or cream; patterned or tropical shirts; a burgundy or orange tie or pocket square. Ties optional.",
    },
    {
      label: "For her",
      body: "Flowing midi or maxi dresses, jumpsuits or two-piece sets in the palette — satin, chiffon and linen all work beautifully in the heat.",
    },
    {
      label: "Accessories",
      body: "Gold or silver jewellery, woven bags, flowers in your hair — go for it.",
    },
    {
      label: "Shoes",
      body: "Parts of the celebration are on grass, so block heels, wedges or flats are your best friend.",
    },
    {
      label: "Áo dài welcome!",
      body: "An áo dài in olive, orange or wine red would be stunning. Hoi An is famous for its tailors — ask us for recommendations.",
    },
    {
      label: "Welcome Dinner & Farewell Brunch",
      body: "Smart casual, palette optional.",
    },
  ],
  avoid: "Please avoid white, ivory and very pale pastels.",
};

/* ------------------------------------------------------------------- RSVP */

/**
 * RSVP đi qua Glow RSVP Hub. KHÔNG tự tạo Google Sheet, KHÔNG dán Apps Script:
 * chạy skill `glow-rsvp` để nó tạo Sheet và điền ba giá trị dưới đây.
 *
 *   mode "general"      — một form mở, ai có link site cũng trả lời được
 *   mode "personalized" — mỗi khách một link `?to=<slug>`, site gọi tên khách
 */
export const rsvp = {
  mode: "general" as "general" | "personalized",
  /** URL của Glow RSVP Hub — skill glow-rsvp điền vào. */
  endpoint:
    "https://script.google.com/macros/s/AKfycbxB9Oc65toi-UmEfTB_J6d3l8LQoNQvhpyY1IaIIKR2h8I59K1NxvCGTZckTqLaT5y_/exec",
  /** Slug của khách, trùng subdomain: tinawill.gloweb.site → "tinawill" */
  client: "tinawill",

  eyebrow: "R.S.V.P",
  title: "Will you join us?",
  subtitle: "We'd love to have you by the river with us.",
  note: "Please let us know so we can plan rooms, transport and catering.",
  deadline: "Kindly reply by November 30, 2026",

  fields: {
    name: { label: "Full name", placeholder: "Your full name" },
    attending: {
      label: "Will you be joining us?",
      yes: "Joyfully accepts",
      no: "Regretfully declines",
    },
    companion: {
      label: "Will you bring a guest?",
      options: ["Just me", "Yes, with my partner / family"],
    },
    roomSharing: {
      label: "Room-sharing preferences",
      placeholder: "Who you'd like to share a room with, if anyone",
    },
    extendStay: {
      label: "Extend your stay? (at your own expense)",
      placeholder: "Which extra nights you're thinking of",
    },
    dietary: {
      label: "Food allergies or dietary needs?",
      none: "No allergies",
      yes: "Yes, please specify",
      placeholder: "Tell us what to avoid",
    },
  },

  submit: "Send RSVP",
  sending: "Sending…",
  successTitle: "Thank you!",
  successNote: "We've got your answer — see you in Hoi An.",
  errorNote: "That didn't go through. Please try once more.",
  /** Lời nhắn cho khách bấm "Regretfully declines". */
  declineNote:
    "Can't make it? We'll miss you — and we'll be raising a glass to you from Hoi An.",
  /** Chào khách vào bằng link riêng — chỉ dùng khi mode "personalized". */
  greeting: "Dear",
};

/* ------------------------------------------------------------------ GIFTS */

export const gifts = {
  eyebrow: "Gifts",
  title: "Honeymoon Fund",
  /**
   * Bình gốm đứng giữa khi section vừa mở ra — bấm vào nó mới hiện ba lựa
   * chọn. Tên file trong brand/elements, bỏ đuôi.
   */
  jar: "honeymoon-jar" as const,
  /** Dòng mời bấm dưới bình, đổi chữ theo lúc đóng / lúc mở. */
  jarPrompt: {
    closed: "Tap the jar",
    open: "Tap to close",
  },
  subtitle: "Your presence is already the greatest gift.",
  intro:
    "Having you travel all this way to celebrate with us is truly the greatest gift — please don't feel you need to bring anything more. If you'd still like to give something, here are a few options — whatever feels right for you.",
  options: [
    {
      title: "Honeymoon fund",
      body: "A contribution towards our honeymoon would help us create memories we'll treasure for the rest of our lives.",
      /** TODO: thay bằng chi tiết chuyển khoản / PayPal / Wise khi khách gửi. */
      note: "",
      actions: [] as { label: string; href: string }[],
    },
    {
      title: "A wedding gift",
      body: "If you'd prefer to give a gift, there will be a gift table at the reception. Since many of you are flying in, small and light is perfect — no need to squeeze anything big into your suitcase! You're also welcome to send something to us after the wedding; just message us on WhatsApp for our address.",
      note: "",
      actions: [] as { label: string; href: string }[],
    },
    {
      title: "A note",
      body: "Honestly, a handwritten card with your wishes means just as much to us.",
      note: "",
      actions: [] as { label: string; href: string }[],
    },
  ],
};

/* --------------------------------------------------------------- THANK YOU */

export const thankYou = {
  eyebrow: "Thank you",
  title: "See you by the river",
  subtitle: "March 27, 2027 — Hoi An",
  lines: [
    "Thank you for travelling all this way",
    "to celebrate the start of our life together.",
  ],
  signature: "Tina & Will",
  image: "/images/couple-06.jpg",
  imageAlt: "Tina and Will",
};

/* ------------------------------------------------------------------ NHẠC */

/**
 * Nhạc nền. `src` để "" thì nút nhạc tự ẩn và trang vẫn chạy bình thường.
 * Nhạc chỉ bật từ chính cú chạm "Open invitation" — trình duyệt trên điện
 * thoại không cho phát nhạc ngoài một thao tác của người dùng.
 *
 * Đang dùng file mẫu của khung nền: thay public/audio/music.mp3 khi khách
 * chọn được bài.
 */
export const music = {
  src: "/audio/music.mp3",
  enabled: true,
  title: "",
  volume: 0.55,
};

/* ------------------------------------------------------------------- META */

export const meta = {
  /** Domain thật của site — dùng để dựng link ảnh OG tuyệt đối. */
  siteUrl: "https://tinawill.gloweb.site",
  title: "Tina & Will — March 27, 2027, Hoi An",
  description:
    "Join Tina & Will for a weekend of love, food and celebration by the river in Hoi An, Vietnam — Saturday, March 27, 2027.",
  /** Ảnh hiện khi dán link lên WhatsApp / Facebook. */
  ogImage: "/images/hero.jpg",
  locale: "en_US",
  lang: "en",
};
