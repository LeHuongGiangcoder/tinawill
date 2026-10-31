# Animation guide: artwork 1 → artwork 2

## Ý đồ chuyển động

Camera giữ hướng nhìn thẳng từ trên xuống nhưng **hạ độ cao dần**, mô phỏng một drone đi xuyên qua các tầng tán lá rồi tiến gần mặt sông. Đây là chuyển động 2.5D bằng camera scale, parallax và từng đợt mở tán, không phải kéo rèm ngang đồng loạt.

Camera zoom nhẹ từ 1,00 lên 1,16 trong 5 giây, dịch lên 28 native px quanh điểm nhìn `(576,1065)`. Lớp gần camera mở trước và có độ phóng/độ cong quỹ đạo lớn hơn; lớp sâu mở sau và di chuyển ít phô trương hơn. Hướng camera không nghiêng hoặc xoay.
Giữ nguyên nét vẽ, màu và alpha của assets. Không vẽ lại cảnh, không tăng độ sắc, không thêm đổ bóng đen hoặc glow vào element.

## Hệ tọa độ và responsive

- Canvas thiết kế: **1152 × 2048**, tỷ lệ **9:16**.
- `x`, `y` là **tâm của sprite** trong hệ tọa độ canvas gốc.
- `width` là chiều ngang sprite trước rotation; chiều cao giữ đúng tỷ lệ của ảnh.
- `rotation` dùng độ theo chiều CSS, đã đổi dấu từ công cụ ghép ảnh. Không đổi dấu lần nữa.
- `flipX` là lật ảnh theo trục ngang trước rotation.
- `z` càng lớn càng ở phía trước. Không sắp layer theo tên file hoặc vị trí trái/phải.
- Scale toàn bộ artboard bằng **một hệ số chung**. Không scale, stretch hoặc cover riêng từng layer.
- Mobile full screen: `scale = max(viewportWidth / 1152, viewportHeight / 2048)`, căn artboard ở giữa và crop phần dư. Có thể dùng `min` để hiển thị trọn artwork; demo giữ khung đúng 9:16 nên không crop.
- Giữ text và nút là HTML để đọc được, focus được và thay nội dung dễ dàng. Không bake nội dung thật vào PNG nền giấy.

## Thứ tự lớp

| Tầng | Thành phần | Z chính |
| --- | --- | --- |
| Dưới cùng | Hai tile nước nối vòng | 0 |
| Trên mặt nước | Gợn nước và 4 vật nổi | 199–200 |
| Nền tán kín | `canopy-ground.png`, fade trong lúc mở | 500 |
| Tán sâu | `deep_left`, `deep_right` | 1000–1100 |
| Lá nền hai bờ | `bank_left`, `bank_right` | 2000–2100 |
| Giấy mời | `paper.png` | 3000 |
| Cụm hoa lá tiền cảnh | `top_*`, `mid_*`, `bottom_*`, `lower_bract` | 4000–4600 |
| Nội dung và nút trên giấy | HTML overlay | 10000 |

Giấy nằm sau cây tiền cảnh. Vì vậy lá vẫn che lên viền giấy tự nhiên. Khi mở, gợn và vật nổi phải nằm dưới toàn bộ cây bờ sông.

## Camera và thứ tự mở từng tầng

Thời lượng tổng: **5 giây**. Không nén về 2–3 giây và không khởi động mọi layer cùng lúc.

| Giai đoạn | Thời gian | Hành động |
| --- | --- | --- |
| Bắt đầu hạ camera | 0,00–5,00 s | Camera scale 1,00 → 1,16, dịch Y 0 → −28 px, smootherstep |
| Nhường vùng nội dung | 0,00–1,08 s | HTML fade trong 0,65 s; giấy fade từ 0,45 đến 1,90 s |
| Tầng gần 1 | 0,28–1,70 s | Lá rời và cụm trái dưới bắt đầu mở |
| Tầng gần 2 | 0,74–2,07 s | Cụm phải dưới mở tiếp, không cùng nhịp trái |
| Tầng giữa 1 | 1,34–2,81 s | Lá phía trái mở; tầng sâu vẫn còn đóng |
| Tầng giữa 2 | 1,73–3,21 s | Tàu lá bên phải mở tiếp |
| Tầng trên trái | 2,27–3,69 s | Cụm xoài và lá phía trên trái nhường đường |
| Tầng trên phải | 2,64–4,06 s | Tán phía trên phải mở tiếp |
| Hai bờ | 2,93–4,55 s | Lá nền rẽ, chỉ giữ bố cục ít lá chuối đã duyệt |
| Tầng sâu | 3,32–4,91 s | Tán sâu trái rồi phải rời khung; mặt sông hiện đầy đủ |
| Chạm tới mặt sông | 4,91–5,00 s | Camera ổn định, chuyển sang idle trôi liên tục |

Các đợt chỉ overlap ở phần cuối để chuyển động liền mạch. Trong khoảng 0,8 giây đầu, các lớp giữa và sâu **chưa được mở**. Đây là khác biệt quan trọng so với bản mở rèm trước.

### Cấu trúc camera

Giữ artboard responsive ở lớp ngoài. Bên trong tạo `camera-world` bọc nước, cây, giấy và vật nổi. Áp transform camera lên wrapper này, không ghi đè responsive scale của artboard.

```js
u = clamp((revealTime - camera.start) / camera.duration, 0, 1);
cameraT = u*u*u*(u*(u*6 - 15) + 10);
scale = lerp(1, 1.16, cameraT);
y = -28 * cameraT;
// origin: 576px 1065px
world.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
```

### Quỹ đạo của từng layer

Với mỗi instance, dùng delay/duration riêng trong manifest. `smootherstep` cho vận tốc và gia tốc về 0 tại hai đầu, tránh giật ngay lúc bắt đầu.

```js
u = clamp((revealTime - delay) / duration, 0, 1);
t = u*u*u*(u*(u*6 - 15) + 10);
lift = sin(PI*t);
x = lerp(closed.x, open.x, t) + motion.arcX*lift;
y = lerp(closed.y, open.y, t) + motion.arcY*lift;
width = lerp(closed.width, open.width, t) * (1 + motion.liftScale*lift);
rotation = lerp(closed.rotation, open.rotation, t) + motion.bend*lift;
```

`arcX` được giới hạn theo khoảng dịch để không bật ngược về cuối. `liftScale` chỉ 3–9% và `bend` tối đa 1,9°. Không thêm bounce, rung hoặc quay mạnh. Tầng gần có độ phóng thoáng qua lớn hơn tầng sâu, tạo cảm giác lá đi qua phía trước camera.

Bố cục cuối vẫn dùng open pose đã duyệt. Camera phóng 16% làm crop nhẹ các mép ở trạng thái cuối một cách có chủ ý. Không đo lại và dịch thêm cây để bù crop này; nếu muốn đối chiếu artwork 2 ở tỷ lệ gốc, tạm đặt `camera.scaleTo = 1` và `offsetY = 0`.


## Lá chuối ở trạng thái mở

Các lá nền không cùng dừng ở một khoảng cách. Ba lá tiếp tục đi xa khỏi khung và giảm opacity về 0; ba lá còn lại nhỏ hơn, lệch góc và nằm sát bờ. Điều này đã thể hiện trên từng instance trong manifest.

**Không giữ nguyên hai layer `bank_left.png` và `bank_right.png` rồi chỉ translate nhẹ.** Cách đó sẽ tái tạo hai hàng lá chuối quá dày mà người dùng đã yêu cầu bỏ. Nếu dùng layer phẳng, các file `bank_left_open.png`, `bank_right_open.png` chỉ để đối chiếu trạng thái cuối; dùng element riêng cho chuyển tiếp đẹp.

## Nước luôn chuyển động

File: `assets/water/river-seamless.webp` hoặc PNG tương ứng.

1. Tạo một vùng nước `1152 × 2048`, `overflow: hidden`.
2. Bên trong đặt một belt cao `4096`, chứa hai ảnh tile giống nhau ở y=0 và y=2048.
3. Dịch belt từ `translateY(0)` tới `translateY(-2048px)` trong **240 giây**, `linear`, lặp vô hạn.
4. Hai mép đầu/cuối của tile đã khớp để vòng lặp không tạo cú nhảy. Không dùng `alternate` cho flow chính.
5. Bắt đầu flow khi component được mount, kể cả khi tán cây đang che kín. Không gắn water progress với reveal progress.
6. Không pause flow khi reveal kết thúc, khi thả slider hoặc khi người dùng xem lâu ở artwork 2.
7. Nước chỉ là texture nước. Không dùng ảnh `artwork-2-approved.png` làm background động, vì phao và hoa đăng sẽ bị nhân đôi hoặc đứng yên trong ảnh.

Hướng lên trong demo là lựa chọn art direction, không phải mô phỏng thủy lực. Có thể đảo toàn bộ hướng nếu cần, nhưng giữ nguyên tốc độ chậm và chuyển động liên tục.

## Phao và hoa đăng trôi riêng

Tổng cộng 4 instance: `lantern-01`, `lantern-02`, `ring-01`, `lantern-03`. Ba hoa đăng dùng cùng PNG nhưng là **ba node độc lập**.

| Vật nổi | Chu kỳ cơ sở | Biên độ X | Biên độ Y | Xoay tối đa |
| --- | --- | --- | --- | --- |
| Hoa đăng 1 | 14 s | 10 px | 15 px | 2,2° |
| Hoa đăng 2 | 19 s | 12 px | 18 px | 2,2° |
| Phao | 23 s | 17 px | 23 px | 1,8° |
| Hoa đăng 3 | 17 s | 10 px | 17 px | 2,2° |

Đơn vị px ở đây là native canvas. Khi artboard hiển thị rộng 390 px, biên độ thực tế chỉ khoảng 3–8 px. Nhỏ như vậy mới có cảm giác trôi nhẹ.

Với `w = 2π / period`, `phase` từ manifest:

```js
dx = amplitudeX * (sin(w*t + phase) + 0.22*sin(0.43*w*t + 1.7*phase));
dy = amplitudeY * (cos(0.81*w*t + phase) + 0.18*sin(0.37*w*t + 0.8));
rotation = rotationAmplitude * sin(0.63*w*t + phase + 0.6);
```

- Thời gian `t` là đồng hồ ambient độc lập, không reset ở cuối reveal hoặc khi phát lại.
- Đây là đường trôi nhiều tần số, tránh 4 vật cùng lên xuống như một thanh ngang.
- Giữ vật nổi quanh vị trí bố cục, không cho chúng đi khỏi màn hình rồi teleport về đầu sông.
- Không thêm nhấp nháy hoặc scale phồng xẹp vào đèn. Cảm giác nổi đến từ đường trôi và xoay rất nhẹ.
- PNG phao đã có alpha ở lòng phao; nước bên dưới phải nhìn xuyên qua.

## Gợn nước

Mỗi loại vật nổi có ripple PNG/WebP riêng. Gợn dùng nét vẽ lấy từ ảnh gốc, nền trong suốt. Đặt theo `ripple.x/y/width/height` của instance, z thấp hơn vật nổi một bậc.

Cho gợn nở tối đa 13%, opacity khoảng 0,2–0,5 theo chu kỳ 4,8–6 giây. Gợn theo 65% độ dịch của vật nổi, không xoay cùng phao. Không đặt một hình chữ nhật nước cũ dưới vật nổi: nó sẽ thành miếng vá di chuyển trên dòng sông.

## Hiệu năng và tương tác

- Tải ảnh trước khi cho phép bấm mở để tránh lá xuất hiện chậm.
- Giữ một `requestAnimationFrame` cho reveal và vật nổi; flow nước dùng CSS transform.
- Dùng WebP trong website. PNG để chỉnh sửa hoặc làm fallback.
- Chỉ đặt `will-change` trên belt và 4 vật nổi, không trên mọi lá cây vĩnh viễn.
- Có thể ngừng cập nhật khi tab ẩn. Khi trở lại tab, tiếp tục nhẹ nhàng.
- Demo có reduced motion: nước 600 giây/vòng, biên độ trôi còn 12%. Có nút pause chủ động. Mặc định không pause tự động khi mở xong.
- Khi rời component, hủy rAF, observer và listener theo lifecycle của framework.

## Kiểm tra trước bàn giao website

- Trạng thái đầu bám artwork 1; trạng thái cuối dùng open pose artwork 2 với crop camera 16% có chủ ý.
- Không có cuống lá nổi, ngọn bị cắt mới hoặc tàu lá bị chồng trùng.
- Hai bờ giữ bố cục bất đối xứng; không gom lại thành 4 cụm ở 4 góc.
- Scrub reveal ở 0%, 25%, 50%, 75%, 100% không hở nền trắng; các tầng sâu phải chưa mở ở giai đoạn đầu.
- Đứng ở 100% ít nhất 30 giây: nước, 3 hoa đăng và phao vẫn đang trôi, không đồng bộ nhịp.
- Chạy qua ranh giới 240 giây không thấy đường nối hoặc bước nhảy của nước.
- Không có phao/đèn đứng yên bị bake trong background và một bản sao động chồng lên.
