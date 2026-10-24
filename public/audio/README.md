# public/audio

`music.mp3` hiện là 8 giây im lặng — ảnh mẫu của âm thanh, để nút nhạc có cái
mà phát khi dựng thử. Thay bằng bài của khách, giữ nguyên tên file.

Cấu hình ở `music` trong `content/client.ts`: `enabled: false` hoặc `src: ""`
thì nút nhạc tự ẩn và trang vẫn chạy bình thường.

Nhạc chỉ bật từ chính cú chạm "Mở thiệp" — trình duyệt trên điện thoại chặn
mọi lần phát nhạc không sinh ra từ thao tác của người dùng.
