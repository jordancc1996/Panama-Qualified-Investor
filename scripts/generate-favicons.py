"""Crop the flag mark from the lockup and write the favicon set."""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "assets" / "panama-qualified-investor-logo.png"
OUT_DIR = ROOT / "public"
ASSETS = ROOT / "src" / "assets"
BG = (255, 255, 255)


def tight_flag_crop(im: Image.Image) -> Image.Image:
    rgb = np.array(im.convert("RGB"))
    ink = ~((rgb[:, :, 0] >= 254) & (rgb[:, :, 1] >= 254) & (rgb[:, :, 2] >= 254))
    cols = ink.any(axis=0)
    runs: list[tuple[int, int]] = []
    start: int | None = None
    for i, filled in enumerate(cols):
        if filled and start is None:
            start = i
        elif not filled and start is not None:
            runs.append((start, i - 1))
            start = None
    if start is not None:
        runs.append((start, len(cols) - 1))
    if not runs:
        raise SystemExit("Could not find the flag mark in the source logo.")
    x0, x1 = runs[0]
    slice_ink = ink[:, x0 : x1 + 1]
    ys = np.where(slice_ink.any(axis=1))[0]
    y0, y1 = int(ys.min()), int(ys.max())
    return im.convert("RGB").crop((x0, y0, x1 + 1, y1 + 1))


def fit_in_square(flag: Image.Image, size: int, margin_ratio: float = 0.0) -> Image.Image:
    canvas = Image.new("RGB", (size, size), BG)
    inner = max(1, int(round(size * (1 - 2 * margin_ratio))))
    fw, fh = flag.size
    scale = min(inner / fw, inner / fh)
    nw = max(1, int(round(fw * scale)))
    nh = max(1, int(round(fh * scale)))
    resized = flag.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2))
    return canvas


def main() -> None:
    im = Image.open(SRC)
    flag = tight_flag_crop(im)
    ASSETS.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    crop_path = ASSETS / "flag-mark.png"
    flag.save(crop_path, "PNG")
    print(f"crop {flag.size} -> {crop_path}")

    sizes = {
        "favicon-16x16.png": (16, 0.0),
        "favicon-32x32.png": (32, 0.0),
        "android-chrome-192x192.png": (192, 0.04),
        "android-chrome-512x512.png": (512, 0.04),
        "apple-touch-icon.png": (180, 0.10),
    }
    for name, (size, margin) in sizes.items():
        out = fit_in_square(flag, size, margin)
        dest = OUT_DIR / name
        out.save(dest, "PNG")
        print(f"wrote {dest.name} {out.size}")

    ico_src = fit_in_square(flag, 48, 0.0)
    ico_path = OUT_DIR / "favicon.ico"
    ico_src.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"wrote {ico_path.name}")


if __name__ == "__main__":
    main()
