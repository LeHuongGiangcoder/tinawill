# Tropical reveal package

Bộ layer và animation cho intro website cưới mobile first. Phiên bản 2.1: camera drone hạ dần, các tầng tán mở nối tiếp trong 5 giây. Giữ PNG vẽ tay gốc, artwork 1 đã duyệt và artwork 2 với ít lá chuối hơn.

## Dùng ngay

1. Giải nén toàn bộ thư mục. Mở `index.html` để xem demo. Không cần cài thư viện, không dùng CDN.
2. Upload **cả thư mục** vào vibe coding tool. Giữ nguyên đường dẫn tương đối của assets.
3. Dán nội dung `VIBE-CODING-PROMPT.md` vào tool.
4. Yêu cầu tool đọc `scene-manifest.json` trước khi dựng. Không đoán lại vị trí từ ảnh reference.
5. Thay nội dung HTML placeholder trên giấy bằng lời mời thực tế. Giữ artwork và tọa độ gốc.

## Các file chính

| File / thư mục | Công dụng |
| --- | --- |
| `ANIMATION-GUIDE.vi.md` | Timeline, quy tắc chuyển động và tích hợp |
| `VIBE-CODING-PROMPT.md` | Prompt để dán vào công cụ coding |
| `scene-manifest.json` | Tọa độ, z-index, closed/open pose, timing của từng instance |
| `LAYER-MAP.csv` | Bảng tra nhanh 36 instance cây, hoa và trái cây |
| `scene-data.js` | Cùng dữ liệu JSON, nạp được khi mở HTML trực tiếp |
| `index.html`, `demo.css`, `demo.js` | Demo và source animation không phụ thuộc thư viện |
| `assets/elements/` | 12 element gốc; PNG và WebP có alpha, ngọn lá quạt đã hoàn thiện |
| `assets/water/river-seamless.*` | Nước riêng, nối vòng theo chiều dọc, không có vật nổi |
| `assets/floaters/` | Phao và hoa đăng tách nền thật, cả lòng phao trong suốt |
| `assets/ripples/` | Gợn nước lấy từ tranh, nền trong suốt |
| `layers/` | Layer PNG trên canvas 1152 × 2048 để import và kiểm tra nhanh |
| `references/` | Hai artwork đã duyệt, dùng để so bố cục |
| `source/composition-authoring.json` | Dữ liệu authoring gốc để đối chiếu |
| `motion-preview.mp4` | Video 13 giây, render từ manifest và công thức chuyển động |
| `VALIDATION.md` | Các kiểm tra đã chạy và giới hạn kiểm tra browser |

PNG là bản dễ chỉnh sửa; WebP là bản nhẹ hơn dùng trong demo. Không áp thêm sharpen, blur hoặc đổi màu.

## Hai cách triển khai

**Khuyến nghị:** dùng `assets/elements/` và manifest để dựng từng element riêng. Cách này xử lý được các lá chuối cần đi xa hơn và những lá còn lại thay đổi góc khi mở.

**Import nhanh:** dùng PNG cùng kích thước trong `layers/`. Tất cả đặt tại `(0,0)` với kích thước `1152 × 2048`. Các file `_open` là biến thể trạng thái cuối, không phải layer bổ sung để chồng lên bản closed. Dùng manifest cho chuyển tiếp chi tiết; không crossfade cả hai artwork.

## Chuyển động liên tục

Nước chạy bằng hai bản sao của tile nối vòng, dịch tuyến tính liên tục trong 240 giây. Ba hoa đăng và một phao có đường trôi riêng, khác chu kỳ và pha. Chuyển động nền không phụ thuộc progress reveal, không dừng ở frame cuối, không reset khi bấm phát lại.

Demo có nút tạm dừng nền để người xem chủ động kiểm tra. Bình thường chuyển động tự chạy. Khi người dùng bật reduced motion, demo giữ dòng nước rất chậm và giảm biên độ vật nổi xuống 12%.

## Chú ý khi xem

Artwork reference là ảnh phẳng đã duyệt. Trong demo, nước và vật nổi dịch chuyển độc lập nên pixel sẽ khác reference ở các thời điểm khác nhau; bố cục cây và thứ tự layer bám manifest, với camera zoom 16% có chủ ý ở trạng thái cuối. Nền nước được xử lý nối vòng từ texture gốc để tránh đường nối nhảy khi chạy lâu.

Nếu tool không chạy được HTML trực tiếp, phục vụ thư mục bằng static server bất kỳ. Không cần backend hoặc API.
