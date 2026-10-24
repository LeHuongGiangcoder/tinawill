# glow-base

Khung nền cho mọi site cưới của Glow. Clone repo này ra, sửa nội dung, đổi ảnh,
nối RSVP — xong một site khách.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP.

## Quy tắc số một

**Làm khách mới chỉ sửa bốn chỗ:**

| Chỗ sửa | Chứa gì |
|---|---|
| `content/client.ts` | Mọi nội dung riêng của khách: tên, gia đình, ngày giờ, địa điểm, love story, album, agenda, dresscode, text từng section, nhạc, RSVP, mảng `sections` (thứ tự hiển thị) và khối `design` (tông màu, nền, hoạ tiết từng section) |
| `content/theme.ts` | Màu, font, thang chữ, nhịp khoảng cách |
| `brand/` | Design system của khách: vân giấy, ảnh nền, hoạ tiết rời, dải ngăn — xem `brand/README.md` |
| `public/images/` | Ảnh cặp đôi — ghi đè theo tên file cố định, xem `public/images/README.md` |
| `public/audio/music.mp3` | Nhạc nền |

**Chỉ sửa `components/` khi khách bespoke** — khi khách cần một section mà khung
nền không có, hoặc cần một bố cục khác hẳn. Sửa component vì "khách này muốn
chữ to hơn" là sai: cỡ chữ nằm ở `theme.ts`.

Nếu phải sửa component cho một khách, cân nhắc: cái sửa đó có dùng lại cho
khách sau không? Nếu có thì nên đưa ngược về glow-base thành một tuỳ chọn trong
`client.ts`, chứ không để mỗi repo khách một bản khác nhau.

## Cấu trúc

```
brand/           design system khách gửi — thả file vào rồi `npm run assets`
  direction.md   creative direction: tinh thần, bảng màu, font, nền từng section
  textures/ backgrounds/ elements/ dividers/
content/
  client.ts      nội dung của khách — sửa file này là xong một site
  theme.ts       token thiết kế: palette, typography, spacing, motion
  assets.ts      TỰ SINH từ brand/ — bản kê có kiểu, đừng sửa tay
components/
  ui/            hệ component dùng chung, tất cả đọc token từ theme.ts
    SectionWrapper  vỏ section: nhịp dọc, lề ngang, bảng màu theo tông
    Heading         Heading / Eyebrow / Lead / Caption / Script / SectionHead
    Button          Button + ButtonLink
    Divider         gạch ngang, có biến thể viên thoi
    ImageFrame      khung ảnh chung
    Field           FieldLabel / Field / Choice cho form
    Decor           một hoạ tiết rời của khách, đặt lên nền section
    Reveal          đánh dấu khối để GSAP làm hiện khi cuộn tới
    Motion          toàn bộ GSAP của trang, gom vào một chỗ
    MusicToggle     nút bật/tắt nhạc
  experience/
    ExperienceProvider  cổng mở thiệp + nhạc + khoá cuộn
    GuestProvider       tra tên khách từ `?to=` khi RSVP chạy chế độ personalized
  sections/      Intro · Hero · LoveStory · Gallery · WeddingInfo ·
                 Agenda · Dresscode · Rsvp · ThankYou
lib/
  assets.ts      tra asset theo tên, trả null nếu brand/ chưa có
  calendar.ts    dựng link "Thêm vào lịch" của Google Calendar
scripts/
  import-assets.mjs  brand/ → public/brand/ + content/assets.ts
app/
  layout.tsx     font, metadata, in token của theme.ts ra CSS variable
  globals.css    cầu nối theme.ts ↔ utility của Tailwind + vài class dùng chung
  page.tsx       render section theo mảng `sections` trong client.ts
public/
  images/        tên file cố định — xem README trong đó
  audio/music.mp3
```

## Cách hệ thống style hoạt động

`content/theme.ts` là nguồn duy nhất của màu, chữ, khoảng cách. `layout.tsx` in
các token đó thành CSS variable `--t-*` trên `:root`, rồi `app/globals.css` map
chúng vào utility của Tailwind qua `@theme inline`.

Vì vậy **component không được viết số padding/margin cứng**. Luôn dùng utility
đã map sẵn — chỉ có năm bậc khoảng cách:

| Utility | Dùng khi |
|---|---|
| `px-gutter` | lề ngang (đã cộng safe-area cho máy có tai thỏ) |
| `py-section` | khoảng trên/dưới của một section |
| `gap-block` / `mt-block` | giữa hai khối lớn trong cùng section |
| `gap-stack` | giữa các phần tử trong một khối |
| `gap-tight` | giữa các dòng chữ đi liền nhau |

Cỡ chữ cũng vậy: `text-display`, `text-h1`…`text-h4`, `text-lead`, `text-base`,
`text-small`, `text-eyebrow`. Không `text-[22px]`.

Màu thì dùng nhóm `tone`: `bg-tone-bg`, `text-tone-fg`, `text-tone-muted`,
`text-tone-accent`, `border-tone-line`. `SectionWrapper` nhận prop `tone`
(`light` | `paper` | `dark`) và đặt `data-tone`, nên nút, gạch, input bên trong
tự đổi màu theo section mà không cần truyền prop.

## Ba luật thiết kế — không được phá

Ba cái này hay bị phạm nhất, và lần nào cũng làm site xấu đi theo cùng một kiểu.

### 1. Không bao giờ làm mờ hoạ tiết cho chìm vào nền

Hoạ tiết (`Decor`, hoa, ruy băng, monogram) **để nguyên `opacity: 1`**. Muốn
nó dịu xuống thì chọn màu nhạt hơn khi xuất file, hoặc đặt nó ở chỗ ít đè chữ
— đừng hạ opacity. Hoạ tiết mờ không "tinh tế", nó chỉ thành một vết bẩn xám
nhoè vào nền, và trên màn hình điện thoại ngoài nắng thì mất hẳn.

`opacity` vẫn là một prop của `DecorPlacement`, nhưng **chỉ dùng khi chính
người dùng yêu cầu**. Không tự ý hạ xuống vì thấy "hơi chói".

Ngoại lệ duy nhất, vì nó không phải hoạ tiết: `overlay` của ảnh nền — đó là
lớp phủ để chữ đọc được, không phải để làm mờ cái gì.

Chữ cũng vậy: muốn chữ nhạt hơn thì dùng `text-tone-muted`, **không** dùng
`opacity-70`.

### 2. Bóng đổ phải mềm

Chỉ dùng hai token có sẵn: `shadow-paper` (mặc định) và `shadow-lift` (khi vật
được nhấc lên). Cả hai đều là **blur lớn, spread âm, alpha thấp** — bóng toả
rộng và nhạt, như giấy đặt trên giấy.

Không viết bóng mới trong component. Nếu thật sự cần một bậc nữa thì thêm vào
`shadow` trong `content/theme.ts`, và giữ đúng công thức: blur ≥ 2× offset,
spread âm, alpha ≤ 0.45. Bóng cứng (blur nhỏ, alpha cao, viền sắc) làm thiệp
trông như giao diện quản trị.

### 3. Section mới phải dùng lại hệ có sẵn

Thêm section thì **đọc `app/globals.css` và `content/theme.ts` trước**. Mọi
màu, cỡ chữ, khoảng cách, bo góc, bóng, nhịp chuyển động đã có token và
utility — dùng lại chúng.

- Không viết CSS riêng cho một section.
- Không thêm CSS Module, không `style={{ padding: 24 }}`, không `text-[22px]`.
- Cần một khuôn dùng chung chưa có (kiểu `.reel`, `.field-input`)? Thêm vào
  `@layer components` trong `globals.css` với tên chung chung, để section sau
  dùng lại được — đừng đặt tên theo section.
- Cần một bậc token mới? Thêm vào `theme.ts`, không hardcode tại chỗ.

Cái test đơn giản: đổi một màu trong `theme.ts` mà section mới không đổi theo,
tức là nó đã tự tạo style riêng — sai.

## Design system của khách

Khách gửi bộ nhận diện (vân giấy, hoạ tiết, dải ren) thì **không chép tay vào
`public/`**. Quy trình:

1. Thả file vào `brand/textures|backgrounds|elements|dividers/`.
2. Điền `brand/direction.md` (có `direction.example.md` làm mẫu).
3. `npm run assets` — chép sang `public/brand/`, đọc kích thước, sinh
   `content/assets.ts`. Lệnh này cũng chạy tự động trước mỗi `npm run build`.
4. Gắn vào section ở khối `design` trong `content/client.ts`.

```ts
weddingInfo: {
  anchor: "wedding-info",
  tone: "dark",
  background: "ring-olive",   // tên file trong brand/backgrounds, bỏ đuôi
  overlay: 0.78,              // độ mờ lớp phủ, cao hơn = chữ dễ đọc hơn
  texture: "paper-olive",
  divider: "lace-band",
  decor: [
    { name: "lily-left", at: "top-[6%] -left-[6%] w-[28%]", rotate: -8, sway: true },
    { name: "lily-right", at: "bottom-[4%] -right-[8%] w-[24%]", parallax: 20, hideOnMobile: true },
  ],
},
```

Tên asset được TypeScript kiểm tra theo `content/assets.ts`, nên gõ sai là
build đỏ chứ không âm thầm mất ảnh. `background` nhận thêm đường dẫn `"/..."`
cho ảnh của chính cặp đôi trong `public/images`.

`SectionWrapper` xếp lớp theo thứ tự: ảnh nền → lớp phủ → vân giấy → hoạ tiết
→ nội dung, và dải ngăn nằm trên cùng vì nó cưỡi lên đường nối hai section.
Dải ngăn được tô bằng **màu chữ của section** qua CSS mask, nên một file ren
dùng được cho cả nền sáng lẫn nền tối.

**Đổi diện mạo một section là sửa `design`, không phải sửa file section.**
File section chỉ còn nói "tôi là section nào" (`<SectionWrapper section="agenda">`).

## Chuyển động

Mọi animation nằm ở `components/ui/Motion.tsx`, chạy một lần cho cả trang.
Section chỉ gắn attribute, không section nào tự gọi GSAP — nhờ vậy chúng vẫn là
server component.

| Attribute | Hiệu ứng |
|---|---|
| `data-reveal` (hoặc `<Reveal>`) | hiện dần khi cuộn tới |
| `data-reveal-delay="120"` | trễ ms, cho các khối hiện so le |
| `data-parallax="30"` | trôi chậm hơn trang 30% khi cuộn |
| `data-hero` | hiện theo cú chạm mở thiệp, không chờ cuộn |

`prefers-reduced-motion: reduce` thì Motion hiện hết ngay và không dựng trigger
nào. JS tắt thì thẻ `<noscript>` trong `layout.tsx` trả lại opacity cho các
khối `[data-reveal]`, nên khách vẫn đọc được đủ thiệp.

## RSVP

**Không tự tạo Google Sheet, không dán Apps Script.** Dùng skill `glow-rsvp`:
nó đọc field của form, tạo Sheet cho khách qua Glow RSVP Hub với đúng cột, rồi
điền `endpoint` + `client` vào `content/client.ts`.

```
# trong session Claude Code
skill glow-rsvp
```

Hai chế độ, đặt ở `rsvp.mode` trong `client.ts`:

- `general` — một form mở, ai có link site cũng trả lời được.
- `personalized` — mỗi khách một link `?to=<slug>`, `GuestProvider` tra tên từ
  hub và site gọi tên khách.

`endpoint` trong glow-base để **trống**. Secret của hub nằm ở `~/.glow/rsvp.env`
và **không bao giờ** được vào repo.

Đổi field của form sau này thì phải chạy lại để Sheet có cột tương ứng:

```bash
~/glow-tools/glow-rsvp.sh fields <client> --fields "key=Nhãn;key2=Nhãn 2"
```

## Trước khi push

1. **Luôn kiểm tra mobile trước** — site cưới gần như 100% khách xem trên điện
   thoại. `npm run dev` rồi mở DevTools ở chế độ mobile (iPhone), kiểm tra:
   - không có thanh cuộn ngang ở bất kỳ section nào;
   - màn mở thiệp và nút nhạc không bị vạch home của iPhone che;
   - ô nhập của form không làm Safari tự phóng cả trang khi chạm vào
     (cỡ chữ ô nhập phải ≥ 16px — `text-base`);
   - thử cả chiều ngang: biến thể `short:` dành cho máy nằm ngang.
2. `npm run build` phải xanh.
3. Đã thay hết placeholder: không còn "Tên Cô Dâu", không còn ảnh mẫu, link Maps
   là link thật của khách.
4. Không commit `.env` dưới bất kỳ dạng nào.

## Tiếng Việt

Chỉ dùng font có subset `vietnamese` trên Google Fonts. Font script mua ngoài
thường thiếu `ơ ư đ` và dấu chồng — đặt tên có dấu vào đó là chữ vỡ thành hai
kiểu chữ khác nhau. Cormorant khai cả `italic` thật vì italic giả do trình duyệt
kéo nghiêng làm méo dấu.
