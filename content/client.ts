import type { BackgroundName, DividerName, ElementName, TextureName } from "@/content/assets";
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
  | "loveStory"
  | "gallery"
  | "weddingInfo"
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
 */
export const sections: SectionId[] = [
  "intro",
  "hero",
  "weddingInfo",
  "loveStory",
  "travel",
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
  intro: { anchor: "intro", tone: "dark", background: "/images/intro.jpg", overlay: 0.55 },
  hero: { anchor: "hero", tone: "light", background: "/images/hero.jpg", overlay: 0.7 },
  weddingInfo: { anchor: "wedding", tone: "dark" },
  loveStory: { anchor: "love-story", tone: "paper" },
  travel: { anchor: "travel", tone: "light" },
  agenda: { anchor: "agenda", tone: "paper" },
  dresscode: { anchor: "dresscode", tone: "dark" },
  gallery: { anchor: "gallery", tone: "light" },
  rsvp: { anchor: "rsvp", tone: "light" },
  gifts: { anchor: "gifts", tone: "paper" },
  thankYou: { anchor: "thank-you", tone: "dark" },
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
  mapUrl: "https://www.google.com/maps/search/?api=1&query=NHAAN+Resort+%26+Spa+Hoi+An",
  mapLabel: "View on map",
  note: "A place whose name means home and peace.",
};

/* ------------------------------------------------------------------ INTRO */

export const intro = {
  eyebrow: "Save the date",
  /** Nút mở thiệp. Chính cú chạm này bật nhạc — xem ExperienceProvider. */
  cta: "Open invitation",
  note: "are getting married",
};

/* ------------------------------------------------------------------- HERO */

export const hero = {
  eyebrow: "Together with our families",
  headline: "we invite you to Hoi An to celebrate with us",
  scrollHint: "Scroll",
};

/* -------------------------------------------------------------- LOVE STORY */

export const loveStory = {
  eyebrow: "How we met",
  title: "Our Love Story",
  intro: "Two people, two cultures, one building — and now, one life together.",
  /** Mỗi chương là một thẻ trong băng ảnh kéo ngang. */
  chapters: [
    {
      year: "Chapter one",
      title: "The conversation that didn't end",
      body: "The first time we talked was at an event. The event ended, everyone went home — and we still hadn't finished our conversation. So we took it to a little Chinese restaurant nearby and kept talking till 3am.",
      photo: "/images/couple-01.jpg",
      alt: "Tina and Will",
    },
    {
      year: "Chapter two",
      title: "The same building",
      body: "When it was time to go home, Tina asked Will where he lived. Then we realised we were living in the exact same building. We shared a Grab home that night.",
      photo: "/images/couple-02.jpg",
      alt: "Tina and Will",
    },
    {
      year: "Chapter three",
      title: "Seven days in a row",
      body: "Then the universe got involved. Every single day for the next week we kept running into each other — in the gym, at a cafe, at a different hour each day, without ever planning it. By day seven, it was hard to call it a coincidence.",
      photo: "/images/couple-03.jpg",
      alt: "Tina and Will",
    },
    {
      year: "Chapter four",
      title: "Germany meets America",
      body: "Will's way of seeing the world is shaped by German culture — direct, structured, a bit dry they say. Tina's is shaped by American culture — expressive, spontaneous, always up to do more. Every difference we worked through taught us something new about each other.",
      photo: "/images/couple-04.jpg",
      alt: "Tina and Will",
    },
  ],
  /** Nhịp kết, đứng riêng dưới băng ảnh. Để null thì không hiện. */
  finale: {
    year: "March 2027",
    title: "And the rest, as they say, is history",
    body: "We can't wait to celebrate with you in Hoi An.",
  },
};

/* ---------------------------------------------------------------- GALLERY */

export const gallery = {
  eyebrow: "Album",
  title: "Our favourite moments",
  note: "A few of the photos we love most.",
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
  eyebrow: "The wedding",
  title: "A weekend by the river in Hoi An",
  intro:
    "Join us for a weekend of love, food and celebration by the river in Hoi An. We can't think of a better way to begin our life together than surrounded by the people we love most.",
  saveTheDateLabel: "Save the date",
  venueLabel: "Venue",
  calendarLabel: "Add to calendar",
  photo: "/images/couple-05.jpg",
  photoAlt: "Tina and Will",
};

/* ----------------------------------------------------------------- TRAVEL */

/**
 * Hướng dẫn visa & đi lại. Mỗi khối là một câu hỏi khách hay hỏi; `kind`
 * quyết định cách render:
 *   text    — mấy đoạn văn
 *   bullets — gạch đầu dòng
 *   steps   — danh sách có số, dùng cho quy trình e-visa
 *
 * `highlight` làm khối nổi lên như một thẻ (dùng cho "wedding night is on us").
 * `actions` thành nút ở cuối khối.
 */
export type TravelGroup = {
  title: string;
  kind: "text" | "bullets" | "steps";
  lead?: string;
  items: string[];
  note?: string;
  highlight?: boolean;
  actions?: { label: string; href: string }[];
};

export const travel = {
  eyebrow: "Getting here",
  title: "Visa & Travel Guide",
  intro:
    "Everything you need to get from your front door to the river in Hoi An. Whichever visa option applies to you, your passport must be valid for at least 6 months after you arrive.",
  groups: [
    {
      title: "Do I need a visa?",
      kind: "bullets",
      lead: "Find your passport below.",
      items: [
        "🇪🇺 Europe — mostly visa-free, up to 45 days",
        "🌏 Southeast Asia — visa-free, up to 30 days",
        "🇭🇰 Hong Kong — e-visa required. If you hold both an HKSAR and a BN(O) passport, apply and travel on your HKSAR passport.",
        "🇮🇳 India · 🇲🇻 Maldives · 🇺🇸 USA — e-visa required",
      ],
    },
    {
      title: "How to get your e-visa",
      kind: "steps",
      items: [
        "Apply only on the official site: evisa.gov.vn — look-alike sites charge extra fees.",
        "The fee is USD 25 for single entry, paid by card.",
        "Apply at least 3–4 weeks before your flight.",
        "Check every detail carefully — the fee is non-refundable if there's a mistake.",
        "Choose Da Nang International Airport as your entry point.",
        "Print your approved e-visa and bring it with you.",
      ],
      actions: [{ label: "Open evisa.gov.vn", href: "https://evisa.gov.vn" }],
    },
    {
      title: "Flying in",
      kind: "bullets",
      lead: "Fly into Da Nang International Airport (DAD).",
      items: [
        "From Southeast Asia & Hong Kong: direct flights from most major hubs (Singapore, Bangkok, Kuala Lumpur, Hong Kong), around 2–3 hours.",
        "From Europe: connect via Singapore, Bangkok, Doha, Dubai or Istanbul — or fly into Ho Chi Minh City / Hanoi and take a short domestic flight (about 1h20) to Da Nang.",
        "From India & the Maldives: connect via Ho Chi Minh City, Hanoi, Singapore, Kuala Lumpur or Bangkok.",
        "From the USA: connect via Seoul, Tokyo, Taipei, Hong Kong or Singapore.",
      ],
    },
    {
      title: "From the airport",
      kind: "text",
      items: [
        "The resort is about 40–45 minutes by car. Grab is easy and affordable — when booking a ride, just type in the name of the resort and it will show right up.",
      ],
    },
    {
      title: "Where to stay",
      kind: "text",
      highlight: true,
      lead: "The wedding night is on us. 🏝",
      items: [
        "We're covering one night at NHAAN Resort & Spa Hoi An on Saturday, March 27, 2027 for all our guests — so you can celebrate late and simply walk back to your room.",
        "Staying longer? We'd love for you to join the Welcome Dinner on Friday and the Farewell Brunch on Sunday, and Hoi An is well worth a few extra days. To book additional nights at the resort, contact our wedding planner and the team will take care of everything for you.",
      ],
      actions: [
        { label: "WhatsApp the planner", href: "https://wa.me/84363059436" },
        { label: "Email the planner", href: "mailto:teamhandsheart.planner@gmail.com" },
      ],
    },
    {
      title: "Weather & good to know",
      kind: "bullets",
      items: [
        "Late March is warm and mostly dry — around 24–29°C. Bring sunscreen, sunglasses and a light layer for the evening.",
        "Currency: Vietnamese Dong (VND). Cards work at the resort; carry some cash for markets and cafés.",
        "Grab is the go-to app for rides and food.",
        "Make a holiday of it: Hoi An Ancient Town is just 5 km away, with the best tailor shops, leather shoes and bag stores, and custom silver — enough to bring a whole wardrobe home. The town is beautiful, with lanterns everywhere, amazing food and history.",
        "An Bang Beach, the Marble Mountains and Da Nang City are all nearby to explore.",
      ],
    },
  ] as TravelGroup[],
};

/* ----------------------------------------------------------------- AGENDA */

/**
 * Chương trình ba ngày. Mỗi ngày một khối, trong khối là trục thời gian.
 * Mục không có giờ (ví dụ "Daytime") vẫn hiện, chỉ là nhãn thay cho giờ.
 */
export const agenda = {
  eyebrow: "The weekend",
  title: "Agenda",
  intro: "Exact times will be confirmed closer to the date.",
  days: [
    {
      label: "Friday, March 26",
      title: "Welcome Evening",
      items: [
        { time: "Daytime", title: "Arrive & settle in", note: "Explore Hoi An at your own pace" },
        {
          time: "18:30",
          title: "Welcome Dinner",
          note: "A relaxed evening of drinks, Vietnamese food and catching up before the big day",
        },
      ],
    },
    {
      label: "Saturday, March 27",
      title: "Wedding Day",
      items: [
        { time: "14:00", title: "Check in", note: "Your room at NHAAN is ready" },
        { time: "15:30", title: "Guests gather", note: "" },
        { time: "16:00", title: "Ceremony by the river", note: "" },
        { time: "16:45", title: "Cocktail hour", note: "Photos at golden hour" },
        { time: "18:30", title: "Reception dinner", note: "Speeches & first dance" },
        { time: "21:30", title: "After party", note: "Bring your dancing shoes 💃" },
      ],
    },
    {
      label: "Sunday, March 28",
      title: "Farewell Brunch",
      items: [
        { time: "10:00", title: "Farewell brunch", note: "A slow, sunny goodbye (and recovery)" },
        { time: "12:00", title: "Check-out", note: "" },
      ],
    },
  ],
};

/* -------------------------------------------------------------- DRESSCODE */

export const dresscode = {
  eyebrow: "What to wear",
  title: "Dress Code",
  headline: "Jungle Glam 🌿",
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
  endpoint: "https://script.google.com/macros/s/AKfycbxB9Oc65toi-UmEfTB_J6d3l8LQoNQvhpyY1IaIIKR2h8I59K1NxvCGTZckTqLaT5y_/exec",
  /** Slug của khách, trùng subdomain: tinawill.gloweb.site → "tinawill" */
  client: "tinawill",

  eyebrow: "R.S.V.P",
  title: "Will you join us?",
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
  title: "Gifts & Honeymoon Fund",
  intro:
    "Having you travel all this way to celebrate with us is truly the greatest gift — please don't feel you need to bring anything more. If you'd still like to give something, here are a few options — whatever feels right for you.",
  options: [
    {
      title: "🌴 Honeymoon fund",
      body: "A contribution towards our honeymoon would help us create memories we'll treasure for the rest of our lives.",
      /** TODO: thay bằng chi tiết chuyển khoản / PayPal / Wise khi khách gửi. */
      note: "",
      actions: [] as { label: string; href: string }[],
    },
    {
      title: "🎁 A wedding gift",
      body: "If you'd prefer to give a gift, there will be a gift table at the reception. Since many of you are flying in, small and light is perfect — no need to squeeze anything big into your suitcase! You're also welcome to send something to us after the wedding; just message us on WhatsApp for our address.",
      note: "",
      actions: [] as { label: string; href: string }[],
    },
    {
      title: "💌 A note",
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
