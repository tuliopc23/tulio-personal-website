#!/usr/bin/env python3
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


@dataclass(frozen=True)
class MaskParams:
    alpha_min: int = 10
    sat_min: float = 0.25
    blue_dom_min: float = 0.12
    feather_px: int = 2
    pad_px: int = 56


def build_glyph_alpha_mask(img_rgba: Image.Image, p: MaskParams) -> Image.Image:
    """
    Keep the blue glyph/glow and drop the low-saturation tile.
    Heuristic: alpha>alpha_min AND saturation>sat_min AND blue_dominance>blue_dom_min.
    """
    if img_rgba.mode != "RGBA":
        raise ValueError("Expected RGBA image")

    px = img_rgba.load()
    w, h = img_rgba.size
    mask = Image.new("L", (w, h), 0)
    out = mask.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a <= p.alpha_min:
                continue

            rn, gn, bn = r / 255.0, g / 255.0, b / 255.0
            mx = max(rn, gn, bn)
            mn = min(rn, gn, bn)
            d = mx - mn
            sat = 0.0 if mx == 0 else d / mx
            blue_dom = bn - (rn + gn) / 2.0

            if sat > p.sat_min and blue_dom > p.blue_dom_min:
                out[x, y] = a

    if p.feather_px > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(radius=p.feather_px))
        # Increase contrast slightly after blur so edges stay crisp.
        mask = ImageOps.autocontrast(mask, cutoff=2)

    return mask


def crop_to_mask(mask_l: Image.Image, pad_px: int) -> tuple[int, int, int, int]:
    bbox = mask_l.getbbox()
    if not bbox:
        raise RuntimeError("Mask bbox empty; thresholds too strict?")

    l, t, r, b = bbox
    l = max(0, l - pad_px)
    t = max(0, t - pad_px)
    r = min(mask_l.width, r + pad_px)
    b = min(mask_l.height, b + pad_px)
    return (l, t, r, b)


def center_square(img_rgba: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    w, h = img_rgba.size
    if w > size or h > size:
        # fit inside square
        scale = min(size / w, size / h)
        img_rgba = img_rgba.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)
        w, h = img_rgba.size

    x = (size - w) // 2
    y = (size - h) // 2
    canvas.alpha_composite(img_rgba, (x, y))
    return canvas


def unsharp(img: Image.Image, radius: float, percent: int, threshold: int) -> Image.Image:
    # Pillow's UnsharpMask is good enough for icon-size sharpening.
    return img.filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=threshold))


def render_icon(master_rgba: Image.Image, size: int, *, sharpen: bool) -> Image.Image:
    out = master_rgba.resize((size, size), Image.Resampling.LANCZOS)
    if sharpen:
        # Tiny icons need more help.
        if size <= 32:
            out = unsharp(out, radius=1.2, percent=180, threshold=2)
        else:
            out = unsharp(out, radius=0.8, percent=120, threshold=2)
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate glyph-only brand icons + derived sizes.")
    parser.add_argument(
        "--input",
        default="Icon Exports 2/no-bg.png",
        help="Input PNG (may contain tile).",
    )
    parser.add_argument(
        "--out-dir",
        default="public",
        help="Output directory (default: public).",
    )
    parser.add_argument("--master-size", type=int, default=1024, help="Master square size.")
    parser.add_argument("--alpha-min", type=int, default=10)
    parser.add_argument("--sat-min", type=float, default=0.25)
    parser.add_argument("--blue-dom-min", type=float, default=0.12)
    parser.add_argument("--feather-px", type=int, default=2)
    parser.add_argument("--pad-px", type=int, default=56)
    args = parser.parse_args()

    p = MaskParams(
        alpha_min=args.alpha_min,
        sat_min=args.sat_min,
        blue_dom_min=args.blue_dom_min,
        feather_px=args.feather_px,
        pad_px=args.pad_px,
    )

    input_path = Path(args.input)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    img = Image.open(input_path).convert("RGBA")
    mask = build_glyph_alpha_mask(img, p)
    crop_box = crop_to_mask(mask, p.pad_px)

    img_c = img.crop(crop_box)
    mask_c = mask.crop(crop_box)

    glyph = Image.new("RGBA", img_c.size, (0, 0, 0, 0))
    glyph = Image.composite(img_c, glyph, mask_c)
    master = center_square(glyph, args.master_size)

    # Keep theme split for wiring consistency; for now both are identical.
    master_light_path = out_dir / "brand-glyph-light.png"
    master_dark_path = out_dir / "brand-glyph-dark.png"
    master.save(master_light_path)
    master.save(master_dark_path)

    # Derived icons (all from light for now; wiring may still pick theme at runtime)
    render_icon(master, 16, sharpen=True).save(out_dir / "favicon-16x16.png")
    render_icon(master, 32, sharpen=True).save(out_dir / "favicon-32x32.png")
    render_icon(master, 180, sharpen=True).save(out_dir / "apple-touch-icon.png")
    render_icon(master, 192, sharpen=True).save(out_dir / "android-chrome-192x192.png")
    render_icon(master, 512, sharpen=False).save(out_dir / "android-chrome-512x512.png")

    print("Wrote:")
    for pth in [
        master_light_path,
        master_dark_path,
        out_dir / "favicon-16x16.png",
        out_dir / "favicon-32x32.png",
        out_dir / "apple-touch-icon.png",
        out_dir / "android-chrome-192x192.png",
        out_dir / "android-chrome-512x512.png",
    ]:
        print(f"- {pth}")


if __name__ == "__main__":
    main()

