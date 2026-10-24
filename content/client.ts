import type { BackgroundName, DividerName, ElementName, TextureName } from "@/content/assets";
import type { Tone } from "@/content/theme";

/**
 * NỘI DUNG CỦA KHÁCH — làm site mới thì sửa duy nhất file này (và theme.ts,
 * public/images, public/audio). Không cần mở components.
 *
 * ⚠️ Toàn bộ giá trị dưới đây là PLACEHOLDER. Trước khi gửi khách phải thay
 * hết: tên, ngày giờ, địa chỉ, link Maps, ảnh, nhạc, RSVP endpoint.
 *
 * Ngày giờ luôn viết dạng ISO kèm offset Việt Nam (+07:00) để lịch và đồng hồ
 * đếm ngược không lệch múi giờ.
 */

/* --------------------------------------------------------------- SECTIONS */

/** Mọi section có trong khung nền. */
export type SectionId =
  | "intro"
  | "hero"
  | "loveStory"
  | "gallery"
  | "weddingInfo"
  | "agenda"
  | "dresscode"
  | "rsvp"
  | "thankYou";

/**
 * Thứ tự hiển thị. Bỏ một section khỏi mảng này là nó không render nữa —
 * không cần xoá code. Đổi chỗ hai dòng là đổi thứ tự trên trang.
 *
 * `intro` là màn mở thiệp, luôn nằm ngoài luồng cuộn; để nó trong mảng thì
 * có cổng mở thiệp, bỏ ra thì trang mở thẳng vào hero.
 */
export const sections: SectionId[] = [
  "intro",
  "hero",
  "loveStory",
  "gallery",
  "weddingInfo",
  "agenda",
  "dresscode",
  "rsvp",
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
  /** Dải ngăn cưỡi lên đường nối với section phía trên. */
  divider?: DividerName | null;
  decor?: DecorPlacement[];
};

/**
 * Mặt nhìn của từng section — tông màu, nền, hoạ tiết.
 *
 * Tách khỏi file section để đổi diện mạo là sửa nội dung chứ không sửa code.
 * Tên asset lấy từ `content/assets.ts`, file đó do `npm run assets` sinh ra
 * sau khi bạn thả file vào `brand/`. Gõ sai tên là TypeScript báo đỏ ngay.
 *
 * Khung nền để trống hết phần nền — site chạy bằng màu phẳng của theme.
 */
export const design: Record<SectionId, SectionDesign> = {
  intro: { anchor: "intro", tone: "dark", background: "/images/intro.jpg", overlay: 0.55 },
  hero: { anchor: "hero", tone: "light", background: "/images/hero.jpg", overlay: 0.7 },
  loveStory: { anchor: "love-story", tone: "paper" },
  gallery: { anchor: "gallery", tone: "light" },
  weddingInfo: { anchor: "wedding-info", tone: "dark" },
  agenda: { anchor: "agenda", tone: "light" },
  dresscode: { anchor: "dresscode", tone: "paper" },
  rsvp: { anchor: "rsvp", tone: "light" },
  thankYou: { anchor: "thank-you", tone: "dark" },
};

/* ------------------------------------------------------------------ COUPLE */

export const couple = {
  /** Tên hiển thị lớn ở hero và màn mở thiệp */
  groom: "Tên Chú Rể",
  bride: "Tên Cô Dâu",
  /** Tên đầy đủ, dùng trong phần thông tin lễ cưới */
  groomFull: "Họ Tên Đầy Đủ Chú Rể",
  brideFull: "Họ Tên Đầy Đủ Cô Dâu",
  hashtag: "#TenChuReCuoiTenCoDau",
};

/** Bố mẹ hai bên — hiện ở section Thông tin lễ cưới */
export const families = [
  {
    side: "Nhà trai",
    people: [
      { role: "Ông", name: "Họ Tên Bố Chú Rể" },
      { role: "Bà", name: "Họ Tên Mẹ Chú Rể" },
    ],
    home: "Địa chỉ nhà trai",
  },
  {
    side: "Nhà gái",
    people: [
      { role: "Ông", name: "Họ Tên Bố Cô Dâu" },
      { role: "Bà", name: "Họ Tên Mẹ Cô Dâu" },
    ],
    home: "Địa chỉ nhà gái",
  },
];

/* -------------------------------------------------------------- NGÀY & GIỜ */

export const ceremony = {
  /** Giờ khai tiệc. Lịch, đồng hồ đếm ngược và link Google Calendar đều tính từ đây. */
  startISO: "2026-12-20T17:30:00+07:00",
  /** Giờ tan tiệc — chỉ dùng cho link thêm vào lịch. */
  endISO: "2026-12-20T21:30:00+07:00",
  weekday: "Chủ Nhật",
  dateShort: "20 . 12 . 2026",
  timeLabel: "17:30",
  /** Ngày âm — gia đình tự đọc, không tính tự động. */
  lunar: "Tức ngày 02 tháng 11 năm Bính Ngọ",
};

export const venue = {
  name: "Tên Nhà Hàng / Trung Tâm Tiệc Cưới",
  hall: "Tên sảnh — Tầng X",
  address: "Số nhà, đường, phường, quận, thành phố",
  /** Link Maps của khách. Nên dùng link chia sẻ ghim sẵn, đừng để ?query= tự tìm. */
  mapUrl: "https://www.google.com/maps",
  mapLabel: "Xem bản đồ",
  note: "Kính mời quý khách tới sớm ít phút để kịp chụp hình cùng gia đình.",
};

/* ------------------------------------------------------------------ INTRO */

export const intro = {
  eyebrow: "Save the Date",
  /** Nút mở thiệp. Chính cú chạm này bật nhạc — xem ExperienceProvider. */
  cta: "Mở thiệp",
  note: "Trân trọng kính mời",
};

/* ------------------------------------------------------------------- HERO */

export const hero = {
  eyebrow: "Trân trọng kính mời",
  headline: "đến chung vui cùng gia đình chúng tôi",
  scrollHint: "Cuộn xuống",
};

/* -------------------------------------------------------------- LOVE STORY */

export const loveStory = {
  eyebrow: "Chuyện của chúng mình",
  title: "Love Story",
  intro: "Vuốt sang để xem những khoảnh khắc chúng mình giữ lại.",
  /** Mỗi chương là một thẻ trong băng ảnh kéo ngang. */
  chapters: [
    {
      year: "2020",
      title: "Lần đầu gặp nhau",
      body: "Một dòng kể ngắn về lần đầu hai người gặp nhau.",
      photo: "/images/couple-01.jpg",
      alt: "Cô dâu và chú rể trong lần đầu gặp nhau",
    },
    {
      year: "2022",
      title: "Chính thức yêu",
      body: "Một dòng kể ngắn về lúc hai người thành một đôi.",
      photo: "/images/couple-02.jpg",
      alt: "Cô dâu và chú rể khi mới yêu",
    },
    {
      year: "2024",
      title: "Cùng nhau đi khắp nơi",
      body: "Một dòng kể ngắn về những chuyến đi của hai người.",
      photo: "/images/couple-03.jpg",
      alt: "Cô dâu và chú rể trong một chuyến đi",
    },
    {
      year: "2026",
      title: "Lời cầu hôn",
      body: "Một dòng kể ngắn về lời cầu hôn.",
      photo: "/images/couple-04.jpg",
      alt: "Cô dâu và chú rể trong ngày cầu hôn",
    },
  ],
  /** Nhịp kết, đứng riêng dưới băng ảnh. Để null thì không hiện. */
  finale: {
    year: "Tháng 12 . 2026",
    title: "Và chúng mình cưới",
    body: "Hẹn gặp quý khách trong ngày trọng đại.",
  },
};

/* ---------------------------------------------------------------- GALLERY */

export const gallery = {
  eyebrow: "Album",
  title: "Khoảnh khắc của chúng mình",
  note: "Những tấm hình chúng mình thương nhất.",
  /** Chữ gợi ý cho người xem biết dải ảnh kéo ngang được. */
  hint: "Vuốt sang để xem tiếp",
  shots: [
    { src: "/images/gallery-01.jpg", alt: "Ảnh cưới số 1" },
    { src: "/images/gallery-02.jpg", alt: "Ảnh cưới số 2" },
    { src: "/images/gallery-03.jpg", alt: "Ảnh cưới số 3" },
    { src: "/images/gallery-04.jpg", alt: "Ảnh cưới số 4" },
    { src: "/images/gallery-05.jpg", alt: "Ảnh cưới số 5" },
    { src: "/images/gallery-06.jpg", alt: "Ảnh cưới số 6" },
  ],
};

/* ------------------------------------------------------------ WEDDING INFO */

export const weddingInfo = {
  eyebrow: "Thông tin lễ cưới",
  title: "Ngày chúng mình về chung một nhà",
  intro: "Kính mời quý khách tới dự tiệc mừng lễ thành hôn.",
  saveTheDateLabel: "Save the date",
  venueLabel: "Địa điểm",
  calendarLabel: "Thêm vào lịch",
  photo: "/images/couple-05.jpg",
  photoAlt: "Cô dâu và chú rể",
};

/* ----------------------------------------------------------------- AGENDA */

export const agenda = {
  eyebrow: "Chương trình",
  title: "Trình tự buổi lễ",
  intro: "Giờ dự kiến của buổi tiệc.",
  items: [
    { time: "17:30", title: "Đón khách", note: "Quý khách nhận chỗ và chụp hình lưu niệm" },
    { time: "18:00", title: "Làm lễ", note: "Nghi thức thành hôn" },
    { time: "18:30", title: "Khai tiệc", note: "Mở tiệc cùng gia đình hai bên" },
    { time: "19:30", title: "Tiệc sau lễ", note: "Âm nhạc và chúc phúc" },
  ],
};

/* -------------------------------------------------------------- DRESSCODE */

export const dresscode = {
  eyebrow: "Trang phục",
  title: "Dress Code",
  headline: "Thanh lịch & trang trọng",
  note: "Để khung hình ngày cưới thật hoà hợp, kính mời quý khách chọn trang phục theo bảng màu dưới đây.",
  /** Để mảng rỗng thì phần bảng màu tự ẩn. */
  swatches: [
    { name: "Xanh rêu", hex: "#1d3a2b" },
    { name: "Kem", hex: "#f1e7d6" },
    { name: "Vàng đồng", hex: "#b99a5b" },
    { name: "Trắng", hex: "#ffffff" },
  ],
  avoid: "Xin hạn chế trang phục màu trắng tinh của cô dâu.",
};

/* ------------------------------------------------------------------- RSVP */

/**
 * RSVP đi qua Glow RSVP Hub. KHÔNG tự tạo Google Sheet, KHÔNG dán Apps Script:
 * chạy skill `glow-rsvp` để nó tạo Sheet và điền ba giá trị dưới đây.
 *
 *   mode "general"      — một form mở, ai có link site cũng trả lời được
 *   mode "personalized" — mỗi khách một link `?to=<slug>`, site gọi tên khách
 *
 * `endpoint` để TRỐNG trong khung nền. Secret của hub không bao giờ nằm trong
 * repo — nó ở ~/.glow/rsvp.env.
 */
export const rsvp = {
  mode: "general" as "general" | "personalized",
  /** URL của Glow RSVP Hub — skill glow-rsvp điền vào. */
  endpoint: "",
  /** Slug của khách, trùng subdomain: ten-khach.gloweb.site → "ten-khach" */
  client: "",

  eyebrow: "R.S.V.P",
  title: "Quý khách sẽ đến chứ?",
  note: "Nhắn giúp chúng mình một tiếng để gia đình chuẩn bị chỗ ngồi chu đáo.",
  deadline: "Vui lòng phản hồi trước ngày 10 . 12 . 2026",

  fields: {
    name: { label: "Họ và tên", placeholder: "Nguyễn Văn A" },
    attending: {
      label: "Quý khách có tham dự?",
      yes: "Có, tôi sẽ đến",
      no: "Rất tiếc, tôi xin vắng",
    },
    guests: { label: "Số người đi cùng", none: "Tôi đi một mình", max: 4 },
    side: {
      label: "Khách nhà",
      options: ["Nhà trai", "Nhà gái"],
    },
    message: {
      label: "Lời chúc gửi cô dâu chú rể",
      placeholder: "Chúc hai bạn trăm năm hạnh phúc…",
    },
  },

  submit: "Gửi phản hồi",
  sending: "Đang gửi…",
  successTitle: "Đã nhận được!",
  successNote: "Cảm ơn quý khách. Chúng mình sẽ giữ sẵn một chỗ thật đẹp.",
  errorNote: "Gửi chưa được, quý khách thử lại giúp chúng mình một lần nữa nhé.",
  /** Chào khách vào bằng link riêng — chỉ dùng khi mode "personalized". */
  greeting: "Thân mời",
};

/* --------------------------------------------------------------- THANK YOU */

export const thankYou = {
  eyebrow: "Thank you",
  title: "Cảm ơn quý khách",
  lines: [
    "Cảm ơn quý khách đã dành thời gian",
    "đồng hành cùng chúng mình trong ngày trọng đại.",
  ],
  signature: "Tên Chú Rể & Tên Cô Dâu",
  image: "/images/couple-06.jpg",
  imageAlt: "Cô dâu và chú rể",
};

/* ------------------------------------------------------------------ NHẠC */

/**
 * Nhạc nền. `src` để "" thì nút nhạc tự ẩn và trang vẫn chạy bình thường.
 * Nhạc chỉ bật từ chính cú chạm "Mở thiệp" — trình duyệt trên điện thoại
 * không cho phát nhạc ngoài một thao tác của người dùng.
 */
export const music = {
  src: "/audio/music.mp3",
  enabled: true,
  title: "Tên bài hát — Nghệ sĩ",
  volume: 0.55,
};

/* ------------------------------------------------------------------- META */

export const meta = {
  /** Domain thật của site — dùng để dựng link ảnh OG tuyệt đối. */
  siteUrl: "https://ten-khach.gloweb.site",
  title: "Tên Chú Rể & Tên Cô Dâu — Thiệp cưới",
  description:
    "Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi ngày 20.12.2026.",
  /** Ảnh hiện khi dán link lên Zalo / Facebook. */
  ogImage: "/images/hero.jpg",
  locale: "vi_VN",
  lang: "vi",
};
