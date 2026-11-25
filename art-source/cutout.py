"""Potong tiga tokoh dari gambar sumber, hapus latar terang di luar garis tepi stiker,
lalu simpan sebagai WebP transparan (figur penuh) + WebP persegi (avatar wajah).

Pemakaian: python cutout.py <gambar_sumber> <folder_keluaran> [--preview]
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
PREVIEW = '--preview' in sys.argv
OUT.mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert('RGB')
W, H = im.size
sx, sy = W / 2000, H / 1116  # koordinat di bawah diukur pada skala 2000Ã—1116

# (kiri, atas, kanan, bawah) figur penuh, dan kotak wajah untuk avatar
BOXES = {
    'irwan':    {'full': (40, 205, 690, 965),    'face': (195, 255, 515, 575)},
    'harry':    {'full': (680, 190, 1335, 965),  'face': (855, 250, 1175, 570)},
    'suprapto': {'full': (1335, 190, 1995, 965), 'face': (1490, 245, 1810, 565)},
}

def scale(b):
    return (round(b[0] * sx), round(b[1] * sy), round(b[2] * sx), round(b[3] * sy))

def remove_light_background(rgb):
    a = np.asarray(rgb).astype(np.int16)
    mn, mx = a.min(axis=2), a.max(axis=2)
    cand = (mn > 200) & ((mx - mn) < 45)          # terang & hampir tak berwarna (latar + garis stiker putih)
    region = np.zeros_like(cand)
    region[0, :] = cand[0, :]; region[-1, :] = cand[-1, :]
    region[:, 0] = cand[:, 0]; region[:, -1] = cand[:, -1]
    while True:                                   # flood fill dari tepi lewat piksel kandidat
        grow = region.copy()
        grow[1:, :] |= region[:-1, :]; grow[:-1, :] |= region[1:, :]
        grow[:, 1:] |= region[:, :-1]; grow[:, :-1] |= region[:, 1:]
        grow &= cand
        if (grow == region).all():
            break
        region = grow
    alpha = Image.fromarray(np.where(region, 0, 255).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))  # rapikan halo tepi
    out = rgb.convert('RGBA'); out.putalpha(alpha)
    return out

for key, b in BOXES.items():
    full = im.crop(scale(b['full']))
    if PREVIEW:
        full.save(OUT / f'{key}-crop.png')
        im.crop(scale(b['face'])).save(OUT / f'{key}-face.png')
        continue
    cut = remove_light_background(full)
    cut = cut.crop(cut.getbbox())
    cut.thumbnail((400, 480), Image.LANCZOS)
    cut.save(OUT / f'{key}.webp', 'WEBP', quality=78, method=6)
    face = im.crop(scale(b['face'])).resize((160, 160), Image.LANCZOS)
    face.save(OUT / f'{key}-ava.webp', 'WEBP', quality=82, method=6)
    print(key, cut.size, (OUT / f'{key}.webp').stat().st_size, (OUT / f'{key}-ava.webp').stat().st_size)

print('source', W, H)

