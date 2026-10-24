# public/images

Tên file là cố định — `content/client.ts` trỏ thẳng vào các tên này, nên làm
khách mới chỉ cần ghi đè file, không phải sửa code:

| File | Dùng ở | Tỉ lệ nên dùng |
|---|---|---|
| `intro.jpg` | nền màn mở thiệp | dọc, 3:4 |
| `hero.jpg` | nền trang bìa | dọc, 4:5 — cũng là ảnh OG khi dán link |
| `couple-01…04.jpg` | bốn chương Love Story | dọc, 3:4 |
| `couple-05.jpg` | Thông tin lễ cưới | dọc, 4:5 |
| `couple-06.jpg` | Lời cảm ơn | dọc, 4:5 |
| `gallery-01…06.jpg` | Album | dọc, 2:3 |

Thêm ảnh album thì thêm `gallery-07.jpg`… rồi khai trong `gallery.shots`.
Ảnh nào cũng được `object-cover` nên tỉ lệ lệch một chút không bị méo, chỉ bị
cắt bớt hai mép.

Ảnh hiện tại là ảnh mẫu — phải thay hết trước khi gửi khách.
