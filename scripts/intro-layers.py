"""
Dựng màn mở thiệp từ các layer xuất ra từ Canva (scripts/intro-src/*.png).

Mỗi PNG là một layer nguyên khổ 1080×1920 (xuất @3.125x = 3375×6000), đã nằm
đúng chỗ của nó trong bản thiết kế, nên ghép chồng theo thứ tự Canva là ra đúng
scripts/intro-src/reference.png. Script này:

  1. cắt mỗi layer theo vùng có pixel, thu về hệ toạ độ artboard của cảnh
     (rộng 1536) và lưu public/opening/intro-<tên>.webp;
  2. ghi vị trí, cỡ, thứ tự lớp vào `items` của content/opening-scene.json,
     cùng vị trí tờ giấy (oval trong Canva) và tâm camera.

Nhịp chuyển động (`groups`, `bird`, `leaves`…) vẫn chỉnh tay trong JSON —
script không đụng tới. Layer 7 (con vẹt) không xuất ra: cảnh dùng rig vẹt
nhiều mảnh (thân, đầu, cánh) đã khớp đúng vị trí đó, xem `bird` trong JSON.

Chạy lại:  python3 scripts/intro-layers.py
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "scripts/intro-src"
OUT = ROOT / "public/opening"
SCENE = ROOT / "content/opening-scene.json"

# Bản thiết kế Canva 1080×1920, file xuất 3375×6000.
DESIGN_W = 1080
EXPORT_W = 3375
# Artboard của cảnh rộng 1536 và cao đúng khung 9:16 của thiết kế (2731), để
# tranh phủ kín màn — artboard cao hơn tranh là lộ một dải nền trơn ở mép.
WORLD_W = 1536
WORLD_Y = 0
K = WORLD_W / EXPORT_W

# Thứ tự từ dưới lên đúng như Canva. Tờ giấy (z 300) nằm giữa: các layer dưới
# nó bị giấy đè, các layer trên nó (hibiscus hồng, thiên điểu, vẹt, đu đủ bổ)
# đè lên mép giấy.
LAYERS = [
    # file, tên, nhóm chuyển động, z
    ("4", "palm-leaf", "palm", 210),
    ("9", "branch-tl", "tl", 220),
    ("10", "hibiscus", "hibiscus", 230),
    ("3", "papaya-tr", "tr", 240),
    ("6", "papaya-br", "br", 250),
    ("5", "hibiscus-pink", "pink", 400),
    ("8", "heliconia", "perch", 410),
    ("2", "papaya-half", "half", 430),
]

# Oval giấy trong Canva (đơn vị thiết kế 1080).
OVAL = {"left": 191.28, "top": 615.15, "width": 733.01, "height": 820.15}


def world(v, offset=0.0):
    return round(v * WORLD_W / DESIGN_W + offset, 1)


def main():
    scene = json.loads(SCENE.read_text())
    shift_y = WORLD_Y - scene.get("_worldY", 10.7)
    scene["canvas"] = {"width": WORLD_W, "height": round(WORLD_W * 16 / 9)}
    scene["_worldY"] = WORLD_Y
    # Những toạ độ chỉnh tay theo artboard cũng dời theo.
    scene["bird"]["origin"][1] = round(scene["bird"]["origin"][1] + shift_y, 1)
    for leaf in scene["leaves"]:
        leaf["from"][1] = round(leaf["from"][1] + shift_y, 1)
    for g in scene["groups"].values():
        g["pivot"][1] = round(g["pivot"][1] + shift_y, 1)
    items = []
    for src, name, group, z in LAYERS:
        im = Image.open(SRC / f"{src}.png").convert("RGBA")
        box = im.getchannel("A").point(lambda v: 255 if v > 4 else 0).getbbox()
        crop = im.crop(box)
        w, h = round(crop.width * K), round(crop.height * K)
        crop.resize((w, h), Image.LANCZOS).save(OUT / f"intro-{name}.webp", quality=86, method=6)
        cx = (box[0] + box[2]) / 2 * K
        cy = (box[1] + box[3]) / 2 * K + WORLD_Y
        items.append({
            "id": name,
            "asset": f"/opening/intro-{name}.webp",
            "size": [w, h],
            "group": group,
            "x": round(cx, 1),
            "y": round(cy, 1),
            "width": w,
            "rotation": 0,
            "flipX": False,
            "z": z,
            "flutter": 0,
        })
        print(f"{name:14} {w}x{h} center ({cx:.0f}, {cy:.0f})")

    # Giữ lại các tuỳ chỉnh tay (flutter…) nếu item đã có trong JSON.
    old = {item["id"]: item for item in scene["items"]}
    for item in items:
        if item["id"] in old:
            item["flutter"] = old[item["id"]].get("flutter", 0)
    scene["items"] = items

    # Tờ giấy: oval của paper.webp (paper.box, cỡ 1:1) đặt vào đúng oval Canva.
    paper = scene["paper"]
    box = paper["box"]
    target_x = world(OVAL["left"])
    target_y = world(OVAL["top"], WORLD_Y)
    dx, dy = target_x - box["x"], target_y - box["y"]
    paper["rect"][0] = round(paper["rect"][0] + dx, 1)
    paper["rect"][1] = round(paper["rect"][1] + dy, 1)
    box["x"], box["y"] = target_x, target_y
    box["width"] = world(OVAL["width"])
    box["height"] = world(OVAL["height"])
    paper["scale"] = 1
    paper["z"] = 300

    scene["camera"]["origin"] = [round(target_x + box["width"] / 2), round(target_y + box["height"] / 2)]

    SCENE.write_text(json.dumps(scene, indent=1, ensure_ascii=False) + "\n")
    print("paper box", box, "rect", paper["rect"])


if __name__ == "__main__":
    main()
