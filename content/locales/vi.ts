import type { Translation } from "@/lib/content";

/**
 * BẢN TIẾNG VIỆT — chỉ khai chữ khác bản gốc tiếng Anh (content/client.ts).
 * Mảng phải giữ đúng thứ tự và số phần tử của bản gốc: trộn theo vị trí.
 *
 * Giữ nguyên tiếng Anh những chữ người Việt vẫn quen dùng trên thiệp cưới:
 * "Save the Date", "R.S.V.P".
 */
export const vi: Translation = {
  ceremony: {
    weekday: "Thứ Bảy",
    dateShort: "27 tháng 3, 2027",
  },
  venue: {
    mapLabel: "Xem bản đồ",
    note: "Một nơi mà cái tên mang nghĩa “nhà” và “an”.",
  },
  calendar: {
    title: "Đám cưới Will & Tina",
  },

  intro: {
    label: "Thiệp cưới của Tina và Will",
    title: "Hế lô :)",
    note: "Bọn mình có một tin chấn động muốn kể nè.",
    cta: "Kể nghe coi",
  },

  cover: {
    invitation: "Chúng mình muốn mời\nbạn tới đám cưới!!!",
    logoLabel: "Monogram của Will và Tina",
    yes: "cô ấy đã nói “YES”",
  },

  hero: {
    lead: "Cùng chúng mình tận hưởng một cuối tuần của tình yêu, món ngon và tiệc vui bên dòng sông Hội An, ở một nơi mà cái tên mang nghĩa “nhà” và “an”.",
    closing:
      "Chúng mình không nghĩ ra cách nào đẹp hơn để bắt đầu cuộc sống chung, hơn là được ở giữa những người mình thương nhất, tại nơi kỳ diệu này.",
    scrollHint: "Cuộn xuống",
  },

  loveStory: {
    eyebrow: "Sự khởi đầu",
    title: "Câu chuyện tình yêu",
    paragraphs: [
      "Lần đầu tiên chúng mình nói chuyện với nhau là ở một sự kiện. Sự kiện kết thúc, mọi người ra về hết, vậy mà câu chuyện của hai đứa vẫn chưa xong. Thế là chúng mình kéo nhau ra một quán ăn Trung Hoa nhỏ gần đó và ngồi nói chuyện tới tận 3 giờ sáng. Lúc chuẩn bị về, Tina hỏi Will sống ở đâu. Đến lúc đó cả hai mới ngã ngửa: hóa ra chúng mình ở cùng một tòa nhà. Đêm đó, hai đứa đi chung một chuyến Grab về nhà.",
      "Rồi vũ trụ bắt đầu “nhúng tay”. Suốt một tuần sau đó, ngày nào chúng mình cũng tình cờ chạm mặt nhau, lúc ở phòng gym, lúc ở quán cà phê, mỗi ngày một giờ khác nhau mà chẳng hề hẹn trước. Đến ngày thứ bảy thì khó mà gọi đó là trùng hợp được nữa.",
      "Và phần còn lại, như người ta vẫn nói, đã là lịch sử.",
      "Không phải lúc nào mọi chuyện cũng dễ dàng. Cách Will nhìn thế giới mang đậm văn hóa Đức: thẳng thắn, ngăn nắp và (nghe đồn là) hơi khô khan. Còn Tina thì mang màu sắc văn hóa Mỹ: cởi mở, ngẫu hứng, lúc nào cũng sẵn sàng “chơi thêm chút nữa”. Chúng mình đã có không ít lần “va chạm văn hóa” (và vài cuộc nói chuyện rất, rất dài về chuyện đó đã diễn ra). Nhưng những lần ấy đều là cơ hội để giúp chúng mình hiểu thêm về nhau và gần nhau hơn.",
    ],
    closing:
      "Hai con người, hai nền văn hóa, hai cách nhìn thế giới, và giờ đây là một cuộc đời chung.",
  },

  timeScene: {
    title: "Lưu ngày này",
    intro:
      "Hãy đến chung vui cùng chúng mình vào một cuối tuần ngập tràn yêu thương, đồ ăn ngon và tiếng cười bên dòng sông Hội An — một nơi có cái tên mang ý nghĩa là “nhà” và “bình yên”. Với chúng mình, cách đẹp nhất để bắt đầu “hành trình chung” là được ở bên những người chúng mình thương nhất.",
    calendarLabel: "Thêm vào lịch",
    sceneLabel: "Hai chú mèo ngủ trưa trên ghế tắm nắng giữa khu vườn nhiệt đới",
  },

  venueScene: {
    title: "Nơi tổ chức\nlễ cưới",
    cityLine: "TP. Đà Nẵng, Việt Nam",
    mapLabel: "Xem bản đồ",
    sceneLabel: "Hai ly rượu nâng lên trên bàn tiệc cưới",
  },

  visa: {
    eyebrow: "Trước khi bay",
    title: "Thị thực",
    subtitle: "Dù hộ chiếu nước nào, hạn đều phải còn ít nhất 6 tháng tính từ ngày nhập cảnh nhé.",
    pickPrompt: "Chọn hộ chiếu của bạn",
    pickNote: "Chúng mình sẽ chỉ hiện thông tin dành cho bạn.",
    regionsLabel: "Chọn hộ chiếu",
    visaHeading: "Thị thực của bạn",
    flightHeading: "Đường bay",
    routes: {
      direct: {
        lead: "Bay thẳng tới Đà Nẵng (DAD) — khoảng 2–3 tiếng.",
        items: [
          "Có chuyến bay thẳng từ hầu hết các điểm trung chuyển lớn: Singapore, Bangkok, Kuala Lumpur và Hồng Kông.",
        ],
      },
      asiaHub: {
        lead: "Một chặng nối chuyến, rồi bay thẳng tới Đà Nẵng (DAD).",
        items: ["Nối chuyến qua TP. Hồ Chí Minh, Hà Nội, Singapore, Kuala Lumpur hoặc Bangkok."],
      },
      europe: {
        lead: "Một chặng nối chuyến, rồi bay thẳng tới Đà Nẵng (DAD).",
        items: [
          "Nối chuyến qua Singapore, Bangkok, Doha, Dubai hoặc Istanbul.",
          "Hoặc bay tới TP. Hồ Chí Minh / Hà Nội rồi đi tiếp một chuyến nội địa ngắn — khoảng 1 tiếng 20 phút — tới Đà Nẵng.",
        ],
      },
      pacific: {
        lead: "Một chặng nối chuyến, rồi bay thẳng tới Đà Nẵng (DAD).",
        items: ["Nối chuyến qua Seoul, Tokyo, Đài Bắc, Hồng Kông hoặc Singapore."],
      },
    },
    evisa: {
      title: "Cách xin e-visa",
      items: [
        "Chỉ nộp hồ sơ trên trang chính thức: evisa.gov.vn — các trang giả mạo sẽ thu thêm phí.",
        "Lệ phí là 25 USD cho visa nhập cảnh một lần, thanh toán bằng thẻ.",
        "Nộp hồ sơ ít nhất 3–4 tuần trước chuyến bay.",
        "Kiểm tra kỹ mọi thông tin — nếu có sai sót, lệ phí sẽ không được hoàn lại.",
        "Chọn Sân bay Quốc tế Đà Nẵng làm cửa khẩu nhập cảnh.",
        "In e-visa đã được duyệt và mang theo bên mình.",
      ],
      action: { label: "Mở evisa.gov.vn" },
    },
    airport: {
      title: "Từ sân bay",
      lead: "Resort cách sân bay khoảng 40–45 phút đi ô tô.",
      body: "Đặt Grab rất dễ và rẻ — khi đặt xe, bạn chỉ cần gõ tên resort là nó hiện ra ngay.",
    },
    recommendation: {
      title: "Gợi ý của chúng mình",
      body: "Vì đây là một chặng đường dài, chúng mình gợi ý bạn lên kế hoạch cho một chuyến du lịch dài hơi để khám phá thêm về Việt Nam. Bạn có thể bay tới TP. Hồ Chí Minh hoặc Hà Nội, rồi từ đó di chuyển tới Hội An (Đà Nẵng).",
    },
    regions: [
      { label: "Châu Âu", verdict: "Miễn thị thực, tối đa 45 ngày." },
      { label: "Đông Nam Á", verdict: "Miễn thị thực, tối đa 30 ngày." },
      {
        label: "Hồng Kông",
        verdict: "Cần e-visa.",
        note: "Nếu bạn có cả hộ chiếu HKSAR và BN(O), hãy xin visa và nhập cảnh bằng hộ chiếu HKSAR.",
      },
      { label: "Ấn Độ", verdict: "Cần e-visa." },
      { label: "Maldives", verdict: "Cần e-visa." },
      { label: "Hoa Kỳ", verdict: "Cần e-visa." },
    ],
  },

  travel: {
    eyebrow: "Khi bạn đã tới nơi",
    title: "Cẩm nang",
    intro: "Những thông tin quan trọng cần biết khi tới nơi!!!",
    highlight: ["thông tin quan trọng"],
    introAction: "Bấm vào cánh cửa để mở",
    tabsLabel: "Chọn một chủ đề",
    gateLabel: "Mở cửa",
    tabs: [
      {
        label: "Chỗ ở & Liên hệ",
        groups: [
          {
            topics: [
              {
                label: "Đêm tiệc cưới",
                body: "Đêm tiệc cưới để chúng mình lo nhé. 💛\nChúng mình mời tất cả khách một đêm nghỉ tại NHAAN Resort & Spa Hội An vào Thứ Bảy, 27 tháng 3, 2027 — để bạn có thể quẩy tới khuya rồi thong thả đi bộ về phòng.",
              },
              {
                label: "Ở lại lâu hơn?",
                body: "Hội An rất đáng để nán lại thêm vài ngày. Để đặt thêm đêm tại resort, bạn hãy liên hệ wedding planner của chúng mình qua WhatsApp: +84 363 059 436 hoặc email: teamhandsheart.planner@gmail.com — đội ngũ sẽ lo mọi thứ cho bạn.",
              },
            ],
          },
        ],
      },
      {
        label: "Thời tiết & mẹo nhỏ",
        groups: [
          {
            topics: [
              {
                label: "Thời tiết",
                body: "Cuối tháng 3 trời ấm và hầu như khô ráo, khoảng 24–29°C. Nhớ mang kem chống nắng, kính râm và một chiếc áo mỏng cho buổi tối.",
              },
              {
                label: "Tiền tệ & thanh toán",
                body: "Việt Nam Đồng (VND). Resort nhận thẻ; nên mang theo chút tiền mặt khi đi chợ và quán cà phê.",
              },
              {
                label: "Đi lại",
                body: "Grab là ứng dụng quen thuộc để đặt xe và đồ ăn.",
              },
              {
                label: "Quanh Hội An",
                body: "Phố cổ cách 5 km — đèn lồng, đồ ăn tuyệt vời, cùng những tiệm may đo, đồ da và bạc thủ công đẹp nhất. Biển An Bàng, Ngũ Hành Sơn và Đà Nẵng đều ở gần.",
              },
            ],
          },
        ],
      },
    ],
  },

  agenda: {
    eyebrow: "Cuối tuần",
    title: "Lịch trình",
    pickPrompt: "Bấm vào hình để xem lịch trình chi tiết",
    pickNote: "Giờ chính xác sẽ được xác nhận khi gần tới ngày",
    daysLabel: "Chọn một ngày",
    days: [
      {
        date: "27 tháng 3",
        title: "Ngày cưới",
        items: [
          { title: "Nhận phòng", note: "Phòng của bạn tại NHAAN đã sẵn sàng" },
          { title: "Khách tề tựu" },
          { title: "Lễ cưới bên bờ sông" },
          { title: "Tiệc cocktail", note: "Chụp ảnh lúc hoàng hôn" },
          { title: "Tiệc cưới", note: "Phát biểu & điệu nhảy đầu tiên" },
          { title: "After party", note: "Nhớ mang giày nhảy nhé 💃" },
        ],
      },
      {
        date: "28 tháng 3",
        title: "Ngày chia tay",
        items: [
          {
            title: "Bữa sáng chia tay",
            note: "Thưởng thức bữa sáng tại resort",
          },
          { title: "Trả phòng" },
          { title: "Trà chiều", note: "Dành cho những vị khách ở lại lâu hơn" },
        ],
      },
    ],
  },

  dresscode: {
    eyebrow: "Mặc gì đây",
    title: "Trang phục",
    subtitle: "Jungle Glam 🌿",
    note: "Tiệc cưới của chúng mình diễn ra giữa rặng dừa và cây xanh ven sông, nên chúng mình muốn mang cả khu rừng lên sàn nhảy. Hãy nghĩ đến phong cách rực rỡ, phóng khoáng, ấm áp nhưng vẫn thanh lịch. Phối các màu với nhau, chọn tông xuyệt tông, hoặc dồn hết vào một màu đều được. Hoạ tiết nhiệt đới, hình lá cây và chất liệu mang màu đất đều rất được chào đón.",
    swatches: [
      { name: "Đỏ ruby" },
      { name: "Đỏ son" },
      { name: "Cam quýt" },
      { name: "Xanh ô liu" },
      { name: "Ô liu đậm" },
    ],
    notes: [
      {
        label: "Cho nam",
        body: "Vest linen hoặc vest sáng màu tông ô liu, gỉ sắt hay kem; sơ mi hoạ tiết hoặc sơ mi nhiệt đới; cà vạt hay khăn cài túi màu đỏ rượu hoặc cam. Cà vạt không bắt buộc.",
      },
      {
        label: "Cho nữ",
        body: "Váy midi hoặc maxi bay bổng, jumpsuit hay set hai mảnh theo bảng màu — satin, chiffon và linen đều rất hợp với thời tiết nóng.",
      },
      {
        label: "Phụ kiện",
        body: "Trang sức vàng hoặc bạc, túi đan, hoa cài tóc — cứ thoải mái nhé.",
      },
      {
        label: "Giày",
        body: "Một phần buổi tiệc diễn ra trên bãi cỏ, nên giày gót vuông, đế xuồng hoặc giày bệt là lựa chọn tốt nhất.",
      },
      {
        label: "Rất hoan nghênh áo dài!",
        body: "Một tà áo dài màu ô liu, cam hay đỏ rượu sẽ rất tuyệt. Hội An nổi tiếng với các tiệm may — cứ hỏi chúng mình để được giới thiệu nhé.",
      },
      {
        label: "Nên tránh",
        body: "Vui lòng tránh màu trắng, trắng ngà và các tông pastel quá nhạt.",
      },
    ],
  },

  rsvp: {
    title: "Bạn sẽ đến chứ?",
    note: "Hãy cho chúng mình biết để lo chỗ ở, xe đưa đón và tiệc nhé.",
    deadline: "Vui lòng phản hồi trước ngày 6 tháng 12, 2026",
    fields: {
      name: { label: "Họ và tên", placeholder: "Họ và tên của bạn" },
      whatsapp: { label: "Số WhatsApp", placeholder: "+84 90 123 4567" },
      email: { label: "Email", placeholder: "ban@example.com" },
      attending: {
        label: "Bạn sẽ tham dự chứ?",
        yes: "Rất vui được tham dự",
        no: "Rất tiếc không thể đến",
      },
      roomSharing: {
        label: "Bạn có mong muốn gì về việc ở chung phòng không?",
        hint: "Chúng mình muốn đám cưới thật ấm cúng, nên rất tiếc không thể mời thêm người đi cùng. Chúng mình sẽ sắp xếp chỗ ở theo phòng đôi và phòng hai giường đơn, nên hãy cho chúng mình biết nếu bạn muốn ở chung phòng với ai nhé.",
        placeholder: "Bạn muốn ở chung với ai",
      },
      extendStay: {
        label: "Ở thêm ngày? (tự túc chi phí)",
        placeholder: "Bạn định ở thêm những đêm nào",
      },
      dietary: {
        label: "Dị ứng thực phẩm hoặc yêu cầu ăn uống?",
        none: "Không có yêu cầu đặc biệt",
        yes: "Có, vui lòng ghi rõ",
        placeholder: "Cho chúng mình biết cần tránh món gì",
      },
    },
    submit: "Gửi phản hồi",
    sending: "Đang gửi…",
    changeAnswer: "Đổi câu trả lời",
    successTitle: "Cảm ơn bạn!",
    successNote: "Chúng mình đã nhận được phản hồi — hẹn gặp bạn ở Hội An.",
    errorNote: "Chưa gửi được. Bạn thử lại lần nữa nhé.",
    declineNote:
      "Không đến được sao? Chúng mình sẽ nhớ bạn lắm — và sẽ nâng ly vì bạn từ Hội An.",
    greeting: "Thân gửi",
  },

  gifts: {
    eyebrow: "Quà mừng",
    title: "Quỹ trăng mật",
    jarPrompt: { open: "Chạm để đóng" },
    highlight: ["chạm vào chiếc bình"],
    intro:
      "Việc bạn vượt cả chặng đường xa để đến chung vui đã là món quà lớn nhất với chúng mình rồi, bạn đừng bận tâm phải mang thêm gì nhé. Nếu bạn vẫn muốn gửi chút gì đó, hãy chạm vào chiếc bình để xem vài gợi ý - tuỳ xem thế nào thoải mái nhất cho bạn.",
    options: [
      {
        title: "Quỹ trăng mật",
        body: "Một chút đóng góp vào chuyến trăng mật sẽ giúp chúng mình có thêm những kỷ niệm để trân trọng suốt đời. Nếu bạn muốn đóng góp, sẽ có thông tin PayPal hoặc mã QR ở bàn đón khách. Nếu bạn mang tiền mặt, cũng sẽ có một chiếc hộp để bạn bỏ phong bì vào.",
      },
      {
        title: "Quà cưới",
        body: "Nếu bạn muốn tặng quà, sẽ có bàn nhận quà tại tiệc. Vì nhiều người bay từ xa đến, quà nhỏ gọn là tuyệt nhất, không cần nhét gì cồng kềnh vào vali đâu! Bạn cũng có thể gửi quà sau đám cưới, chỉ cần nhắn WhatsApp để chúng mình gửi địa chỉ nhé.",
      },
      {
        title: "Một tấm thiệp",
        body: "Thật lòng mà nói, một tấm thiệp viết tay kèm lời chúc của bạn cũng ý nghĩa với chúng mình không kém.",
        note: "Cảm ơn bạn từ tận đáy lòng. 💛",
      },
    ],
  },

  thankYou: {
    eyebrow: "Cảm ơn",
    title: "Hẹn gặp bên bờ sông",
    paragraphs: [
      "Từ tận đáy lòng, cảm ơn bạn đã vượt cả chặng đường dài để chung vui trong ngày đặc biệt của tụi mình.",
      "Bạn là những người thân thiết nhất với chúng mình, và chúng mình sẽ vô cùng biết ơn khi được thấy bạn trong ngày cưới.",
      "Thương nhiều!",
    ],
    logoLabel: "Monogram của Will và Tina",
    imageAlt: "Hai chú mèo rót rượu, lúc đầu điềm tĩnh rồi giật mình",
  },

  meta: {
    title: "Tina & Will — 27.03.2027, Hội An",
    description:
      "Cùng Tina & Will tận hưởng một cuối tuần của tình yêu, món ngon và tiệc vui bên dòng sông Hội An — Thứ Bảy, 27 tháng 3, 2027.",
    locale: "vi_VN",
    lang: "vi",
  },
};
