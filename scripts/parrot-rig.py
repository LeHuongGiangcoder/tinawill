"""
Làm sạch rig con vẹt của màn mở thiệp (public/opening/parrot-head.webp,
parrot-body.webp) theo layer 7 của bản Canva (scripts/intro-src/7.png).

Rig gốc cắt từ bức tranh cũ nên có lỗi: mảnh đầu bị cắt thẳng ở mép phải (mất
chóp mỏ), thân còn dính một mảnh mỏ thừa (lộ ra thành "mỏ đôi" khi đầu quay)
và vài mẩu cành đậu bay theo chim. Script đọc bản gốc từ git (commit d492433)
nên chạy lại bao nhiêu lần cũng ra cùng kết quả:

    python3 scripts/parrot-rig.py

Layer 7 khớp với hệ toạ độ của rig ở tỉ lệ 2.22, gốc (-189, 3977) — đo bằng cách
so màu, sai số trung bình ~8/255.
"""
import io
import subprocess
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/opening"
ORIGIN_COMMIT = "d492433"

SCALE, OX, OY = 2.22, -189, 3977
HEAD = (528, 0, 316, 281)  # x, y, w, h trong hệ toạ độ thân — khớp bird.head.rect


def original(name):
    data = subprocess.run(
        ["git", "show", f"{ORIGIN_COMMIT}:public/opening/{name}.webp"],
        cwd=ROOT, capture_output=True, check=True,
    ).stdout
    return Image.open(io.BytesIO(data)).convert("RGBA")


def main():
    body = original("parrot-body")
    old_head = original("parrot-head")
    layer = Image.open(ROOT / "scripts/intro-src/7.png").convert("RGBA")
    # Layer 7 kéo về hệ toạ độ của rig.
    ref = layer.transform(body.size, Image.AFFINE, (SCALE, 0, OX, 0, SCALE, OY), resample=Image.BICUBIC)

    # Đầu: lấy nguyên điểm ảnh của layer 7 (mỏ đủ chóp). Mép cổ vẫn mờ dần theo
    # mặt nạ của đầu cũ để quay đầu không lộ đường cắt; riêng vùng mỏ giữ trọn.
    hx, hy, hw, hh = HEAD
    mask = old_head.getchannel("A")
    beak = Image.new("L", (hw, hh), 0)
    ImageDraw.Draw(beak).rectangle((780 - hx, 0, hw, 190), fill=255)
    mask = ImageChops.lighter(mask, beak.filter(ImageFilter.GaussianBlur(6)))
    head = ref.crop((hx, hy, hx + hw, hy + hh))
    head.putalpha(ImageChops.multiply(head.getchannel("A"), mask))
    head.save(OUT / "parrot-head.webp", quality=90, method=6)

    # Thân: chỉ giữ chỗ layer 7 cũng có (bỏ mẩu cành đậu); chỗ layer 7 bị mép
    # khung cắt (đuôi bên trái, dưới) thì tin thân cũ.
    keep = ref.getchannel("A").filter(ImageFilter.MaxFilter(7))
    clipped = Image.new("L", body.size, 255)
    ImageDraw.Draw(clipped).rectangle((86, 0, body.width, 911), fill=0)
    keep = ImageChops.lighter(keep, clipped)
    # Mảnh mỏ thừa ở góc trên phải — đầu che chỗ này.
    ghost = Image.new("L", body.size, 255)
    ImageDraw.Draw(ghost).rectangle((775, 0, body.width, 170), fill=0)
    # Mẩu cành dính sát mép đuôi trái.
    ImageDraw.Draw(ghost).rectangle((55, 755, 98, 800), fill=0)
    ghost = ghost.filter(ImageFilter.GaussianBlur(3))
    alpha = ImageChops.multiply(ImageChops.multiply(body.getchannel("A"), keep), ghost)

    # Chỉ giữ mảng liền chính của con chim, bỏ mọi mảnh rời.
    solid = alpha.point(lambda v: 255 if v > 24 else 0)
    ImageDraw.floodfill(solid, (400, 400), 128)
    main_part = solid.point(lambda v: 255 if v == 128 else 0).filter(ImageFilter.MaxFilter(5))
    body.putalpha(ImageChops.multiply(alpha, main_part))
    body.save(OUT / "parrot-body.webp", quality=90, method=6)


if __name__ == "__main__":
    main()
