import { useEffect, useState } from "react";

export interface Palette {
  primary: string;
  secondary: string;
}

const cache = new Map<string, Palette>();

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return { h, s, l };
}

async function extract(src: string): Promise<Palette | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Bucket colors by quantized hue (12 buckets)
        const buckets: { count: number; r: number; g: number; b: number; hue: number }[] = [];
        for (let i = 0; i < 12; i++) buckets.push({ count: 0, r: 0, g: 0, b: 0, hue: i * 30 });

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue;
          const { h, s, l } = rgbToHsl(r, g, b);
          if (s < 0.15 || l < 0.1 || l > 0.92) continue; // skip greys / near-black / near-white
          const idx = Math.floor(h / 30) % 12;
          buckets[idx].count++;
          buckets[idx].r += r;
          buckets[idx].g += g;
          buckets[idx].b += b;
        }

        const sorted = buckets.filter((b) => b.count > 0).sort((a, b) => b.count - a.count);
        const toHex = (b: typeof buckets[0]) => {
          const r = Math.round(b.r / b.count);
          const g = Math.round(b.g / b.count);
          const bl = Math.round(b.b / b.count);
          return `rgb(${r}, ${g}, ${bl})`;
        };

        if (sorted.length === 0) {
          resolve({ primary: "rgb(80,80,80)", secondary: "rgb(40,40,40)" });
        } else if (sorted.length === 1) {
          const c = toHex(sorted[0]);
          resolve({ primary: c, secondary: c });
        } else {
          resolve({ primary: toHex(sorted[0]), secondary: toHex(sorted[1]) });
        }
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function useImagePalette(src: string | null | undefined): Palette | null {
  const [palette, setPalette] = useState<Palette | null>(() => (src ? cache.get(src) ?? null : null));

  useEffect(() => {
    if (!src) return;
    const cached = cache.get(src);
    if (cached) {
      setPalette(cached);
      return;
    }
    let cancelled = false;
    extract(src).then((p) => {
      if (cancelled || !p) return;
      cache.set(src, p);
      setPalette(p);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return palette;
}
