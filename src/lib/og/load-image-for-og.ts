import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import sharp from "sharp";

const DEFAULT_FIT = { w: 1200, h: 1200 } as const;

type LoadImageForOgOptions = {
  /**
   * Resize to fit inside this box (px). Used when you do not pass `exactCover`.
   */
  fitWithin?: { w: number; h: number };
  /**
   * Exact output width/height (cover crop in Sharp). Use the same values as the OG
   * `img` width/height so the raster is not rescaled again by Satori (that pass was
   * blurring a 720px asset drawn into a 360px box).
   */
  exactCover?: { w: number; h: number };
};

function normalizePublicPath(path: string): string | null {
  const trimmed = path.trim();
  if (!trimmed || trimmed.includes("..")) {
    return null;
  }
  const rel = trimmed.replace(/^\/+/, "");
  return rel.length > 0 ? rel : null;
}

async function toPngExactCover(
  input: Buffer,
  w: number,
  h: number,
): Promise<string> {
  const ws = w * 2;
  const hs = h * 2;
  const png = await sharp(input)
    .resize(ws, hs, {
      fit: "cover",
      position: "centre",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .resize(w, h, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 6 })
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

async function toPngFitWithin(
  input: Buffer,
  fit: { w: number; h: number },
): Promise<string> {
  const png = await sharp(input)
    .resize(fit.w, fit.h, {
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 6 })
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

async function bufferToPngDataUrl(
  input: Buffer,
  options?: LoadImageForOgOptions,
): Promise<string> {
  if (options?.exactCover) {
    const { w, h } = options.exactCover;
    return toPngExactCover(input, w, h);
  }
  const fit = options?.fitWithin ?? DEFAULT_FIT;
  return toPngFitWithin(input, fit);
}

/**
 * Loads raster bytes for next/og img `src`. Local /public paths are read from disk
 * (avoids fetching the dev server during OG generation). Remote URLs use fetch.
 * Output is PNG so Satori/resvg reliably decodes it (WebP fetch paths were rendering empty).
 */
export async function loadImageForOg(
  pathOrUrl: string,
  options?: LoadImageForOgOptions,
): Promise<string | null> {
  const raw = pathOrUrl.trim();
  if (!raw) {
    return null;
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const res = await fetch(raw);
      if (!res.ok) {
        return null;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      return bufferToPngDataUrl(buf, options);
    } catch {
      return null;
    }
  }

  const rel = normalizePublicPath(raw);
  if (!rel) {
    return null;
  }

  try {
    const abs = join(process.cwd(), "public", rel);
    const buf = await readFile(abs);
    return bufferToPngDataUrl(buf, options);
  } catch {
    return null;
  }
}
