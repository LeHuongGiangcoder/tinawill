# Tropical Reveal
## Animation guide và asset kit

**Khung dọc 9:16 · 1152 × 2048 px · 8,4 giây · phát một lần**

Camera tiến đều vào khoảng hở giữa quả đu đủ bổ đôi và con vẹt. Con vẹt ngoái đầu, hạ người lấy đà, xòe cánh và bay lên chéo phải. Cành gần camera dạt ra trước, các lớp lá phía sau tiếp tục tách dần theo độ sâu. Ba lá nhỏ chao xuống ở các thời điểm khác nhau, cùng một quả đu đủ nhỏ tuột cuống. Camera tiếp tục tiến vào vị trí trống để bạn thêm điểm nhìn cuối.

### Mở kit

- Giải nén cả thư mục, rồi mở `preview.html` trong trình duyệt. Chọn **Phát**, kéo thanh thời gian để xem từng nhịp, hoặc bật **Hiện lưới alpha** và **Hiện vùng điểm nhìn**. Nền ô liu đậm là nền của trình xem.
- Dùng `scene.json` làm dữ liệu gốc khi triển khai. `preview.html` nhúng một bản cấu hình để chạy offline. Khi sửa cấu hình, thay JSON trong thẻ `script#config` nếu muốn cập nhật cả preview.
- Dùng `asset_index.jpg` để tìm sprite bằng mắt. File `assets/reference/opening.png` là ảnh opening gốc dùng để đối chiếu frame đầu.

### Timeline

| Thời gian | Chuyển động | Chi tiết để giữ cảm giác tự nhiên |
|---|---|---|
| 0,00–0,25 s | Camera bắt đầu tiến ngay từ opening | Frame 0 ghép từ các layer ở đúng tọa độ gốc. Zoom tăng ngay từ đầu. |
| 0,25–1,40 s | Chim ngoái đầu, giữ ánh nhìn một nhịp rồi hướng về đường bay | Pivot ở cổ. Nghiêng đầu tối đa khoảng 11°, nén nhẹ theo chiều ngang để gợi xoay và dịch mỏ vài pixel. |
| 1,29–1,76 s | Chim hạ người, lấy đà trên cành | Xoay thân quanh chân đậu. Bắt đầu hé cánh từ 1,60 s. Hai cánh lệch nhịp 0,15 chu kỳ. |
| 1,76–3,24 s | Chim bật lên và bay chéo phải ra khỏi khung | Nội suy quỹ đạo qua các keyframe để vận tốc liên tục. Một nhịp cánh khoảng 0,40 s. Giữ alpha thân khi chim thoát khung. |
| 2,69–5,98 s | Hoa đỏ, quả bổ đôi và hai cụm quả sát mép mở ra trước, cành đậu theo sau | Hoa đỏ và cành dưới phải dạt xuống/phải. Quả bổ đôi đi lên/phải. Cành đậu lùi xuống/trái sau khi chim đã bật đi. Các cửa sổ chuyển động chồng lên nhau. |
| 3,70–6,80 s | Hai tán trên mở về hai góc | Hai bên lệch nhịp khoảng 0,4 s. Cành và những quả còn treo dùng chung transform của cụm. |
| 3,84–6,86 s | Lá chao và quả rơi xuyên qua vùng đang mở | Lá bắt đầu ở 3,84 / 4,55 / 5,13 s. Quả nhỏ bên phải tách khỏi tán ở 4,32 s, giữ vị trí và vận tốc lúc tách rồi rơi tăng tốc. |
| 4,48–8,05 s | Các lớp lá giữa và lá thấp dạt dần về mép | Biên trái, phải và dưới mở lệch nhịp. Các lá sâu có parallax nhẹ hơn cụm ở tiền cảnh. |
| 8,05–8,40 s | Camera tiếp tục tiến vào điểm nhìn cuối | Giữ frame cuối khi phát xong. Điểm nhìn vẫn là slot trống để bạn đặt nội dung. |

### Asset map

| Cụm trong JSON | Sprite opening | Vai trò |
|---|---|---|
| `bird` | `parrot_body`, `parrot_head` | Thân đậu và đầu tách riêng, đi chung theo quỹ đạo bay. |
| `frontUpper` | `fruit_half` | Quả bổ đôi ở giữa đi lên/phải theo cung. |
| `frontLower` | `hibiscus_red` | Hoa đỏ tiền cảnh mở xuống/phải. |
| `frontRight` | `branch_bottom_right`, `fruit_bottom_right` | Cành và quả dưới phải mở như một cụm. |
| `frontLeft` | `vine_front`, `fruit_bottom_left` | Dây leo phía trước đuôi chim và quả dưới trái. |
| `perch` | `branch_perch` | Cành ngang nơi chim đậu. |
| `leftCanopy` | `branch_top_left`, `fruit_left_green`, `hibiscus_orange` | Tán, quả xanh và hoa cam phía trên trái. |
| `rightCanopy` | `branch_top_right`, `accent_upper_right`, `fruit_right_red`, `fruit_right_small` | Tán trên phải. Quả nhỏ là sprite rơi. |
| `midLeft` | `leaves_left_tall`, `leaves_mid_left`, `accent_left` | Các lớp lá trái phía sau tiền cảnh. |
| `midRight` | `leaves_right_mid` | Tán lá giữa bên phải. |
| `midLower` | `floor_leaves`, `accent_lower` | Lá thấp khép bố cục phía dưới. |

Có **22 lớp opening**, **5 sprite hỗ trợ rig** và **3 sprite lá rơi**. PNG dùng alpha và được crop sát vùng có nội dung.

| File bổ sung | Cách dùng |
|---|---|
| `rig/wing_near.png`, `rig/wing_far.png` | Hai cánh xòe được dựng theo nét và màu của chim gốc. Gắn vào `bird.shoulders`. Vẽ cánh xa sau thân và cánh gần nằm giữa thân với đầu. |
| `rig/parrot_body_motion.png` | Thân thay thế có phần lông cổ nối dưới đầu để đầu có thể ngoái. |
| `rig/parrot_tail_fill.png` | Bổ sung phần đuôi lộ ra lúc cất cánh. Áp dụng cả `sourceOffset` để giữ đúng vị trí khi sprite vượt biên gốc. |
| `rig/perch_under_foot.png` | Bù phần cành dưới chân chim. Cho hiện dần trong 1,76–1,88 s, dưới `branch_perch`. |
| `fx/leaf_olive.png`, `fx/leaf_dark.png`, `fx/leaf_copper.png` | Lá đơn dùng làm particle. Vị trí phát, scale, độ lượn và thời điểm nằm trong `leafParticles`. |

Opening lấy pixel trực tiếp từ ảnh gốc. Phần đầu dùng rig 2.5D từ một góc đầu gốc. Hai cánh xòe là sprite bổ sung. Các vùng vốn bị che ở cổ, dưới chân và phía đuôi có phần bù để khi chuyển động mép cắt ít lộ hơn.

### Tọa độ, camera và thứ tự vẽ

- Hệ tọa độ tính bằng pixel trong canvas gốc, gốc trái trên, +x sang phải và +y xuống dưới. `rect = [left, top, width, height]` là hộp sprite trong canvas gốc. `pivot = [x, y]` tính từ góc trái trên của **PNG đã crop**.
- Vẽ các sprite opening theo `z` tăng dần. Các sprite hỗ trợ thiếu `z` nên chỉ được vẽ tại pass của rig hoặc particle. Với sprite có `localSprite: true`, dùng pivot và vị trí gắn của rig, bỏ qua tọa độ `rect[0:2]` trong opening.
- Với một cụm, lấy pivot của **cụm** để cả cành và quả đi cùng nhau. Chỉ dùng pivot **sprite** cho đầu, cánh, lá rơi và quả sau khi tách cuống.
- Camera dùng chung điểm ngắm `A(t)`, từ (576, 1024) đến (576, 934). Gọi `u = clamp(t / 8.4, 0, 1)` và `e = u²(3 − 2u)`. Zoom cơ sở `Z(t) = 1 + 0.48 × (0.27u + 0.73e)`. Trên mỗi lớp có độ sâu `d`, chiếu `Pscreen = canvasCenter + (1 + (Z − 1)d) × (Pworld − A)`.
- Tính phase trên khoảng `start…end`, rồi lấy `progress = smoothstep(phase ** easePower)`, với `easePower` mặc định là 1. Dùng cùng progress cho dịch chuyển và rotation, đồng thời thêm `arcY × sin(π × progress)` vào trục y. Dùng chung đồng hồ cho camera, rig, cành lá và particle để khi tua chúng vẫn đồng bộ.
- Ở thời điểm quả tuột cuống, lấy world transform và vận tốc của nó từ cụm phải trước khi chuyển sang chuyển động rơi. Tăng gia tốc rơi theo y. Với lá, dùng drift ngang và nén chiều rộng nhịp nhàng để gợi lật mặt lá.
- Dùng `requestAnimationFrame` và thời gian theo giây. Preload và decode PNG trước khi bắt đầu. Giữ tỷ lệ 9:16, scale toàn bộ stage theo viewport. Có thể giảm số lá rơi trên thiết bị chậm để giữ nhịp.

### Gắn điểm nhìn cuối

Dùng `finalFocus` trong `scene.json`. Slot nằm dưới mọi lớp cây ở `z = -10`, tâm world **(576, 934)** và depth **0,24**. Đặt tâm nội dung vào tọa độ đó để camera đưa nó về giữa viewport ở frame cuối.

Vùng đặt nội dung quan trọng ở frame cuối rộng **64%** và cao **50%** khung. Mép vùng này ở **18%** từ trái và **25%** từ trên. Preview nhận đường dẫn PNG trong `finalFocus.asset` và fit ảnh vào `maxSize`. Khi tích hợp, slot này cũng có thể là video hoặc component của bạn. Cho điểm nhìn hiện mềm theo `visibility` từ **3,50 đến 5,35 s** để nội dung không hiện qua khe lá từ opening. Nếu điểm nhìn có chữ hoặc nút cần giữ sắc nét, render nội dung HTML theo vị trí đã chiếu của slot.

### Prompt để dán vào vibe coding tool

> Dựng animation “Tropical Reveal” bằng asset trong thư mục này. Dùng `scene.json` làm nguồn tọa độ, pivot, z-order, độ sâu và timing. Tham chiếu `preview.html` để đối chiếu chuyển động. Khung 9:16, 1152 × 2048, dài 8,4 giây và giữ frame cuối. Tại t=0, ghép PNG theo `rect` và `z` sao cho trùng `assets/reference/opening.png`. Chạy một camera push-in liên tục, có parallax theo depth. Animate đầu quanh pivot cổ, cho chim hạ người rồi đập cánh lệch nhịp và bay chéo lên phải theo spline, rời hẳn viewport. Mở các cụm tiền cảnh rồi tán trên rồi lá giữa và lá thấp theo các khoảng thời gian chồng lên nhau trong manifest. Cho quả nhỏ tách ở 4,32 s, kế thừa vị trí/vận tốc của cành rồi rơi tăng tốc và xoay. Cho ba lá đơn chao xuống theo `leafParticles`. Dựng slot `final-focus` dưới các lớp cây, neo ở (576, 934) và để trống khi `asset` là null. Dùng rAF, preload ảnh, giữ 9:16 và chỉ clip ở mép stage. Ưu tiên transform và đường cong chuyển động mềm. Hỗ trợ phát lại, tua và reduced motion theo tùy chọn của giao diện.

### Checklist khi tích hợp

- Ở frame 0, đối chiếu vị trí mắt chim, gốc cuống quả bổ đôi và hai hoa với PNG opening.
- Tua từ 1,5 đến 2,2 s để kiểm tra cổ, điểm gắn cánh và cành dưới chân chim.
- Tua qua 4,32 s để kiểm tra quả bắt đầu rơi ngay từ cuống.
- Tua 5–8 s để kiểm tra thứ tự thoát khung. Khi thêm nội dung cuối, kiểm tra phần quan trọng nằm trong vùng điểm nhìn.
- Với người bật reduced motion, có thể hiển thị opening tĩnh và cho chuyển thẳng đến điểm nhìn qua nút tương tác.
