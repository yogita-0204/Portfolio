"""Generate specimen plates from the source portrait.

hero  -> clean grayscale-neutral webp (the live WebGL halftone shader does the mono work)
about -> baked duotone (ink <-> paper) + film grain, journal plate for the About section

Run: python scripts/make-plates.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src" / "yogita-profile.png"
OUT = ROOT / "public" / "assets"

INK = (25, 21, 16)      # t-day --ink
PAPER = (246, 243, 237)  # t-day --paper


def load_source(max_w):
    # Source is an alpha-cutout headshot: flatten onto white (not black!) —
    # white reads as bare paper in the halftone shader and as --paper in duotone.
    img = Image.open(SRC).convert("RGBA")
    bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    img = Image.alpha_composite(bg, img).convert("RGB")
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    return img


def hero_plate():
    # Shader samples luminance; a gentle autocontrast keeps the business-suit
    # midtones from collapsing into a single dot size.
    img = load_source(1400)
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    out = Image.merge("RGB", (gray, gray, gray))
    out.save(OUT / "yogita-portrait.webp", quality=84, method=6)


def about_plate():
    img = load_source(1000)
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    duotone = ImageOps.colorize(gray, black=INK, white=PAPER)
    # effect_noise returns mean-128 Gaussian noise; a low blend reads as print grain.
    grain = Image.effect_noise(duotone.size, 24).convert("RGB")
    out = Image.blend(duotone, grain, 0.07)
    out.save(OUT / "about-plate.webp", quality=82, method=6)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    hero_plate()
    about_plate()
    for name in ("yogita-portrait.webp", "about-plate.webp"):
        p = OUT / name
        print(f"{name}: {p.stat().st_size // 1024} KB")
