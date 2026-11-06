# Bé mèo đi tìm ghế

Đưa cả thư mục này vào coding tool. Đọc `PROMPT-FOR-CODING-TOOL.txt` trước, rồi mở `demo.html` để xem chuyển động. Demo chạy offline, không cần cài thư viện.

## Ý đồ chuyển động

Bé mèo tuxedo bên trái chưa xuất hiện trên ghế lúc ban đầu. Khi người xem cuộn tới nửa dưới section olive, bé ló từ mép trái, chạy xuống theo đường cong đã đánh dấu, vòng quanh bên trái couple, lấy đà ở cuối section, nhảy xuống qua ranh giới sang section đỏ, đi sát mép trái để tránh text, rồi tiếp đất và ngồi đúng vị trí ghế trái. Mèo xám ở ghế phải giữ nguyên.

Mặc định: chuyển động gắn với scroll. Dừng scroll thì vị trí và nhịp chân dừng; scroll ngược tua ngược hành trình. Khi đã ngồi, bé đứng yên, không chạy chân hoặc nảy liên tục. Không pin section và không khoá cuộn trang.

## File giao

| File | Dùng cho |
|---|---|
| `assets/loungers-no-left-cat.png` | Base ghế mới, PNG alpha 1152 × 2048, đã xoá mèo trái; mèo phải, bàn, khăn, kính và mũ còn nguyên |
| `assets/cat-run-01.png` đến `cat-run-04.png` | Bốn nhịp chạy |
| `assets/cat-crouch.png` | Hạ thân lấy đà |
| `assets/cat-jump.png` | Duỗi người nhảy xuống |
| `assets/cat-land.png` | Chạm ghế, chùng chân |
| `assets/cat-sit.png` | Ngồi yên ở vị trí cuối |
| `assets/cat-atlas.png` | Atlas 2048 × 1024, 4 cột × 2 hàng, thứ tự như trên |
| `assets/manifest.json` | Kích thước, frame rect, anchor và điểm đáp |
| `assets/pose-contact-sheet.jpg` | Xem nhanh tất cả pose trên nền đỏ |
| `integration/cat-scroll.js` | Controller vanilla JS, không dependency |
| `integration/cat-scroll.css` | Quy tắc wrapper, z-index, clipping |
| `demo.html` | Demo độc lập đã nhúng sẵn toàn bộ asset |
| `reference/` | Ảnh gốc và đường đi bạn đã đánh dấu, chỉ để đối chiếu |

Các pose chuyển động và pose ngồi được minh hoạ lại từ bé mèo gốc, giữ lông tuxedo, ngực trắng và đuôi chóp trắng. Đây không phải cutout nguyên pixel của pose ngồi cũ. Base ghế giữ nguyên pixel ảnh gốc bên ngoài vùng nhỏ cần vá sau khi xoá mèo. Hai ảnh `demo-*.jpg` chỉ phục vụ nền demo, không thay artwork thật của website.

## Timeline theo tiến trình scroll

| Progress | Chuyển động | Asset / cách xử lý |
|---|---|---|
| Trước 0% | Chưa có mèo trái | Base ghế trống; cat opacity 0 |
| 0–2.5% | Đi từ ngoài mép trái vào | Fade rất ngắn đồng thời chạy vào khung |
| 0–48% | Chạy theo đường cong ở section olive | Bốn frame chạy; frame phụ thuộc progress, không dùng GIF tự chạy |
| 48–53% | Dừng chân, hạ người lấy đà | Crouch, squash khoảng 5% |
| 53–90% | Một cú nhảy nối hai section | Jump, đường cong xuống mép trái section đỏ; không chạy chân giữa không trung |
| 87.5–90% | Chuẩn bị tiếp đất | Blend ngắn jump → land, xoay người về thẳng |
| 90–95% | Chạm ghế và chùng chân | Land; scaleY tối thiểu 0.90, scaleX tối đa 1.07 |
| 95–99.5% | Ngồi xuống | Blend ngắn land → sit |
| 99.5–100% và sau đó | Ngồi yên | Sit; giữ anchor cố định |

Timeline là phần trăm quãng scroll, không phải thời gian cố định. Controller làm mượt khoảng 65 ms để giảm rung trackpad. Bé không tự chạy hết khi chỉ vừa chạm trigger. Cú nhảy được cách điệu theo scroll, không mô phỏng gia tốc rơi vật lý.

## Tích hợp vào layout hiện có

1. Bọc **cả hai section liền nhau** trong một wrapper `position: relative`. Giữ nguyên layout và độ cao section thật.
2. Thay layer `loungers.png` cũ bằng `loungers-no-left-cat.png`, giữ đúng kích thước hiển thị và vị trí cũ. Không render mèo trái tĩnh thêm lần nữa.
3. Đặt một `catLayer` duy nhất làm con trực tiếp của wrapper chung. Không đặt trong riêng section trên hoặc section dưới. Không reparent giữa chừng.
4. Hai section và wrapper không được `overflow: hidden`, `overflow: clip`, `clip-path`, hoặc `contain: paint` làm cắt mèo ở đường nối. Nếu cần cắt phần ngoài ngang, áp `overflow-x: clip` cho page shell bao ngoài.
5. Giữ foreground lá cây trên mèo nếu đã có layer lá riêng. Mèo phải trên background và ghế, nhưng dưới foreground lá. `pointer-events: none` và `aria-hidden="true"` cho toàn bộ motion layer.
6. Mount sau khi component và ảnh ghế có mặt. Gọi `destroy()` khi unmount; gọi `refresh()` sau thay đổi layout ngoài hệ thống ResizeObserver.

Ví dụ vanilla JS:

```html
<div class="cat-journey-page-shell">
  <div id="journey" class="cat-journey-stage">
    <section id="olive">... nội dung gốc ...</section>
    <section id="saveDate">
      ... nội dung gốc ...
      <img id="loungers" src="/assets/loungers-no-left-cat.png"
           width="1152" height="2048" alt="Hai ghế tắm nắng">
    </section>
    <div id="catLayer" class="cat-journey-layer"></div>
    <!-- foreground lá PNG, nếu có, dùng z-index 40 -->
  </div>
</div>
```

```js
import { mountCatScroll } from './integration/cat-scroll.js';
import './integration/cat-scroll.css';

const motion = mountCatScroll({
  stage: document.querySelector('#journey'),
  upper: document.querySelector('#olive'),
  lower: document.querySelector('#saveDate'),
  art: document.querySelector('#loungers'),
  layer: document.querySelector('#catLayer'),
  assetBase: '/assets/',
  landing: { x: 0.363, y: 0.694 },
  sizeRatio: 0.20,
});

// Khi cleanup: motion.destroy();
// Sau đổi bố cục: motion.refresh();
```

Trong React, gọi hàm này ở `useEffect` với refs và `return () => motion.destroy()`. Không cập nhật React state ở mỗi frame. Với Next.js, chỉ mount ở client. Nếu asset import trả URL đã hash, truyền object `frameSources` có các key `run-01`, `run-02`, `run-03`, `run-04`, `crouch`, `jump`, `land`, `sit`.

## Anchor và kích thước

- Mỗi sprite là canvas PNG trong suốt **512 × 512**. Đừng trim riêng từng frame khi tích hợp.
- Điểm neo chung trên canvas: **x=256, y=448**, tương đương **50%, 87.5%**. Các pose đứng/ngồi được canh theo chân.
- Mèo có frame hiển thị rộng `0.20 × wrapperWidth`. Phần mèo thực tế nhỏ hơn canvas vì có padding, chiều cao pose ngồi gần bằng mèo ban đầu.
- Điểm đáp là chân mèo trong **toàn bộ canvas ảnh ghế chưa crop**: x=36.3%, y=69.4%. Với ảnh 1152 × 2048: khoảng (418, 1421).
- Controller lấy `getBoundingClientRect()` của ảnh ghế để đổi điểm này sang hệ toạ độ wrapper. Không hardcode điểm đáp bằng pixel viewport và không dựa vào phần trăm chiều cao section đỏ.
- Ảnh ghế nên hiển thị bằng `width: ...; height: auto`, không dùng `object-fit: cover`. Nếu layout đang crop ảnh, cần đo content box thật hoặc tự truyền điểm neo đã tính lại.
- Đường chạy trên section olive dùng phần trăm kích thước section để bám layout. Cú nhảy dùng kích thước thực của section dưới và điểm ghế nên tự nối khi responsive.
- Các control point chỉnh trong `measure()` của `cat-scroll.js`. Ưu tiên đối chiếu `reference/trajectory-markup.png`, không vẽ đường thẳng từ góc vào ghế.

## Layer và cảm giác chuyển động

| Lớp | z-index gợi ý |
|---|---:|
| Nền section | 0 |
| Nội dung / couple / ghế | 10 |
| Đường debug, tắt khi ship | 25 |
| Mèo | 30 |
| Lá tiền cảnh tách riêng | 40 |
| Nút hoặc UI nổi | 50 |

Z-index chỉ so sánh được trong cùng stacking context. Tránh transform hoặc z-index bất chợt ở parent của riêng section dưới làm nó che mất mèo. Không dùng `position: fixed` cho mèo: bé sống trong toạ độ document của hai section.

Pose nhảy đã vẽ chéo, chỉ xoay thêm ít. Đừng xoay mèo 90 độ theo tangent đường đi hoặc kéo scaleY dài để giả nhảy. Nhịp chạy phải ngừng khi scroll ngừng. Chỉ blend ở đoạn chuyển trạng thái ngắn, tránh hai silhouette chồng nhau suốt hành trình.

## Accessibility và kiểm tra bàn giao

`prefers-reduced-motion: reduce`: bỏ hành trình, đặt mèo ngồi trên ghế ngay. Controller xử lý cả thay đổi setting khi trang đang mở. Mèo trang trí, không có focus, không chặn click, không che nút Add calendar. Demo chỉ có nút calendar minh hoạ.

Kiểm tra trên width 360, 390, 430 và desktop: không còn mèo trái in trên base; có đúng một motion layer; mèo không bị cắt tại đường nối; không đi xuyên text/date/button; chân ngồi khớp ghế sau resize; không trôi tiếp khi dừng scroll; kéo nhanh tới cuối vẫn ra sit; scroll ngược rồi xuôi vẫn bám path; mở trang bằng deep-link hoặc restore-scroll vẫn đúng pose; reduced motion có mèo ngồi; unmount/remount không thêm listener hoặc sprite trùng.

Để debug, truyền một SVG absolute phủ wrapper qua `debugPath`, với một phần tử `<path>` bên trong. API `setProgress(number)` dành cho kiểm tra; dùng `setProgress(null)` để trả về scroll thật.

## Phạm vi demo

Demo dùng ảnh section trên được cắt bỏ UI trình duyệt, phần đáy được nối bằng màu để xem motion. Section đỏ được dựng lại với texture lấy từ ảnh tham chiếu; lá tiền cảnh và typography không được dựng đầy đủ. Khi tích hợp, **dùng layout thật hiện có**, chỉ thay base ghế và thêm mèo/controller. Bộ này là asset và reference implementation, chưa được gắn vào source website thật.
