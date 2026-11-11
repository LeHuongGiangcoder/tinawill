"""
Cắt các sprite cành lớn của màn mở thiệp (scripts/opening-src/branch-*.webp) thành
từng element rời — hoa, quả, cành đậu, lá — để xếp lại quanh tấm giấy.

Đa giác viết theo toạ độ pixel gốc của sprite nguồn. Chạy lại:
    python3 scripts/opening-cuts.py
Sinh public/opening/<tên>.webp và in ra offset (x0, y0, w, h) của từng mảnh
trong sprite nguồn, để đặt vị trí ở content/opening-scene.json.
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts/opening-src"
OUT = ROOT / "public/opening"


def d(s, pts):
    """Đổi toạ độ đo trên ảnh lưới thu nhỏ (hệ số s) về pixel gốc."""
    return [(x / s, y / s) for x, y in pts]


TL, TR, RIGHT, BOTTOM, LEFT, PINK = 0.6211, 0.52, 0.421, 0.74, 0.7625, 1.0

CUTS = {
    # Cặp hibiscus cam + cành + lá, bỏ quả đu đủ xanh bên trái.
    "hibiscus-pair": ("branch-tl", None, [
        d(TL, [(0, 330), (40, 336), (95, 360), (130, 392), (147, 432), (152, 470), (172, 500),
               (182, 560), (172, 612), (140, 642), (95, 650), (40, 642), (0, 622)]),
    ]),
    # Tán lá + đu đủ bổ đôi, bỏ quả đỏ bị mép tranh cắt và chùm lá dưới nó.
    "papaya-canopy": ("branch-tr", None, [
        d(TR, [(292, 352), (330, 340), (420, 340), (505, 330), (505, 700), (300, 700), (288, 560), (292, 450)]),
    ]),
    # Hoa thiên điểu, bỏ lá vàng/xanh bị mép tranh cắt ở góc trái dưới và mẩu lá rời góc phải.
    "bird-of-paradise": ("branch-left", d(LEFT, [
        (5, 318), (30, 120), (125, 25), (258, 45), (440, 0), (452, 60), (462, 205), (420, 300),
        (330, 420), (240, 520), (200, 600), (168, 600), (160, 560), (150, 470), (175, 395), (60, 345),
    ]), []),
    # Cành đậu của vẹt: chỉ khúc chéo phía trên.
    "perch": ("branch-bottom", d(BOTTOM, [
        (148, 248), (205, 205), (300, 140), (330, 115), (345, 80), (380, 75), (405, 45), (450, 8),
        (495, 0), (508, 20), (498, 48), (430, 125), (400, 135), (395, 155), (345, 160), (300, 192),
        (230, 245), (185, 290), (160, 290),
    ]), []),
    # Chùm lá đu đủ ở đáy, bỏ hoa thiên điểu nhỏ và quả xanh.
    "leaves-low": ("branch-bottom", d(BOTTOM, [
        (255, 330), (300, 280), (385, 245), (430, 205), (500, 195), (565, 200), (612, 222),
        (628, 270), (690, 360), (700, 430), (700, 575), (330, 575), (300, 470), (262, 420),
    ]), [
        d(BOTTOM, [(470, 90), (640, 90), (632, 262), (600, 330), (560, 300), (520, 240), (480, 200)]),
    ]),
    # Quả đu đủ to + lá quanh nó; bỏ hoa cam phía trên và dấu sao ở góc.
    "papaya-low": ("branch-right", d(RIGHT, [(0, 352), (296, 352), (296, 700), (0, 700)]), [
        d(RIGHT, [(225, 625), (280, 625), (280, 690), (225, 690)]),
    ]),
    # Hibiscus hồng, bỏ mẩu cánh rời bên trái.
    "hibiscus-pink": ("branch-pink", None, [
        [(0, 400), (175, 400), (175, 520), (0, 520)],
    ]),
}


def cut(name, src, keep, drop):
    im = Image.open(SRC / f"{src}.webp").convert("RGBA")
    mask = Image.new("L", im.size, 255 if keep is None else 0)
    draw = ImageDraw.Draw(mask)
    if keep is not None:
        draw.polygon(keep, fill=255)
    for poly in drop:
        draw.polygon(poly, fill=0)
    mask = mask.filter(ImageFilter.GaussianBlur(1.2))
    alpha = Image.composite(im.getchannel("A"), Image.new("L", im.size, 0), mask)
    im.putalpha(alpha)
    box = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    out = im.crop(box)
    out.save(OUT / f"{name}.webp", quality=88, method=6)
    return {"src": src, "x0": box[0], "y0": box[1], "w": out.width, "h": out.height}


if __name__ == "__main__":
    info = {name: cut(name, *spec) for name, spec in CUTS.items()}
    json.dump(info, sys.stdout, indent=1)
