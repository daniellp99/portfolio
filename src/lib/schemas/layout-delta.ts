import type { DecodedLayouts } from "@/lib/schemas/layouts";
import { z } from "zod";

const LAYOUT_DELTA_VERSION = 1;
export const LAYOUT_DELTA_MAX_ENCODED_LENGTH = 99;

const LOGICAL_BREAKPOINTS = ["lg", "sm", "xs"] as const;
type LogicalBreakpoint = (typeof LOGICAL_BREAKPOINTS)[number];

const BP_INDEX: Record<LogicalBreakpoint, number> = {
  lg: 0,
  sm: 1,
  xs: 2,
};

const BP_FROM_INDEX: LogicalBreakpoint[] = ["lg", "sm", "xs"];

/** RGL breakpoint keys that mirror a logical layout bucket (see grid defaults). */
const RGL_BREAKPOINT_TO_LOGICAL: Record<string, LogicalBreakpoint> = {
  lg: "lg",
  md: "lg",
  sm: "sm",
  xs: "xs",
  xxs: "xs",
};

const FIELD_ORDER = ["x", "y", "w", "h"] as const;
type LayoutField = (typeof FIELD_ORDER)[number];

const FLAG_W = 1 << 0;
const FLAG_H = 1 << 1;
const HEADER_EXTENDED = 1 << 15;

const MAX_ITEM_INDEX = 31;
const MAX_GRID_X = 15;
const MAX_GRID_Y = 15;

export class LayoutDeltaTooLargeError extends Error {
  constructor(public readonly encodedLength: number) {
    super(
      `Layout delta encodes to ${encodedLength} chars (max ${LAYOUT_DELTA_MAX_ENCODED_LENGTH})`,
    );
    this.name = "LayoutDeltaTooLargeError";
  }
}

const base64urlToBytes = z.codec(z.base64url(), z.instanceof(Uint8Array), {
  decode: (base64urlString) => z.util.base64urlToUint8Array(base64urlString),
  encode: (bytes) => z.util.uint8ArrayToBase64url(bytes),
});

function toCenti(value: number): number {
  return Math.round(value * 100);
}

function fromCenti(centi: number): number {
  return centi / 100;
}

function cloneDecodedLayouts(baseline: DecodedLayouts): DecodedLayouts {
  const out: DecodedLayouts = {};
  for (const [key, items] of Object.entries(baseline)) {
    out[key] = items.map((item) => ({ ...item }));
  }
  return out;
}

export function withRglAliases(layouts: {
  lg: NonNullable<DecodedLayouts["lg"]>;
  sm: NonNullable<DecodedLayouts["sm"]>;
  xs: NonNullable<DecodedLayouts["xs"]>;
}): DecodedLayouts {
  return {
    lg: layouts.lg.map((item) => ({ ...item })),
    sm: layouts.sm.map((item) => ({ ...item })),
    xs: layouts.xs.map((item) => ({ ...item })),
    md: layouts.lg.map((item) => ({ ...item })),
    xxs: layouts.xs.map((item) => ({ ...item })),
  };
}

type ItemFieldDelta = Partial<Record<LayoutField, number>>;

type LayoutChange = {
  bp: LogicalBreakpoint;
  index: number;
  fields: ItemFieldDelta;
};

export type LayoutDelta = LayoutChange[];

function getLogicalLayouts(
  layouts: DecodedLayouts,
  activeBreakpoint?: string,
): Record<LogicalBreakpoint, NonNullable<DecodedLayouts["lg"]>> {
  const logical = {
    lg: layouts.lg ?? [],
    sm: layouts.sm ?? [],
    xs: layouts.xs ?? [],
  };

  if (!activeBreakpoint) return logical;

  const logicalKey = RGL_BREAKPOINT_TO_LOGICAL[activeBreakpoint];
  const activeItems = layouts[activeBreakpoint];
  if (logicalKey && activeItems) {
    logical[logicalKey] = activeItems;
  }

  return logical;
}

function assertGridX(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > MAX_GRID_X) {
    throw new Error(`x out of compact range: ${value}`);
  }
}

function assertGridY(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > MAX_GRID_Y) {
    throw new Error(`y out of compact range: ${value}`);
  }
}

/** Diff `current` vs `baseline` on lg/sm/xs (md→lg, xxs→xs when `activeBreakpoint` is set). */
export function diffLayouts(
  current: DecodedLayouts,
  baseline: DecodedLayouts,
  activeBreakpoint?: string,
): LayoutDelta | null {
  const currentLogical = getLogicalLayouts(current, activeBreakpoint);
  const baselineLogical = getLogicalLayouts(baseline);
  const changes: LayoutDelta = [];

  for (const bp of LOGICAL_BREAKPOINTS) {
    const baseItems = baselineLogical[bp];
    const currentById = new Map(
      currentLogical[bp].map((item) => [item.i, item] as const),
    );

    for (let index = 0; index < baseItems.length; index++) {
      const baseItem = baseItems[index];
      const currentItem = currentById.get(baseItem.i);
      if (!currentItem) continue;

      const fields: ItemFieldDelta = {};
      for (const field of FIELD_ORDER) {
        if (field === "x" || field === "y") {
          if (currentItem[field] !== baseItem[field]) {
            fields[field] = currentItem[field];
          }
        } else if (toCenti(currentItem[field]) !== toCenti(baseItem[field])) {
          fields[field] = currentItem[field];
        }
      }

      if (Object.keys(fields).length > 0) {
        changes.push({ bp, index, fields });
      }
    }
  }

  return changes.length > 0 ? changes : null;
}

export function applyLayoutDelta(
  delta: LayoutDelta,
  baseline: DecodedLayouts,
): DecodedLayouts {
  const logical = getLogicalLayouts(cloneDecodedLayouts(baseline));

  for (const { bp, index, fields } of delta) {
    const item = logical[bp][index];
    if (!item) continue;
    for (const field of FIELD_ORDER) {
      const value = fields[field];
      if (value !== undefined) {
        item[field] = value;
      }
    }
  }

  return withRglAliases(logical);
}

class ByteWriter {
  private readonly bytes: number[] = [];

  pushU8(value: number) {
    this.bytes.push(value & 0xff);
  }

  pushU16LE(value: number) {
    this.pushU8(value & 0xff);
    this.pushU8((value >> 8) & 0xff);
  }

  toUint8Array() {
    return new Uint8Array(this.bytes);
  }
}

class ByteReader {
  private offset = 0;

  constructor(private readonly bytes: Uint8Array<ArrayBufferLike>) {}

  get remaining() {
    return this.bytes.length - this.offset;
  }

  readU8(): number {
    if (this.offset >= this.bytes.length) {
      throw new Error("Unexpected end of layout delta payload");
    }
    return this.bytes[this.offset++];
  }

  readU16LE(): number {
    const lo = this.readU8();
    const hi = this.readU8();
    return lo | (hi << 8);
  }

  rewind(bytes: number) {
    this.offset = Math.max(0, this.offset - bytes);
  }
}

function packChangeHeader(
  bp: LogicalBreakpoint,
  index: number,
  x: number,
  y: number,
  extended: boolean,
): number {
  if (index > MAX_ITEM_INDEX) {
    throw new Error(`Item index out of compact range: ${index}`);
  }
  assertGridX(x);
  assertGridY(y);
  return (
    (extended ? HEADER_EXTENDED : 0) |
    (BP_INDEX[bp] << 13) |
    (index << 8) |
    (x << 4) |
    y
  );
}

function unpackChangeHeader(header: number): {
  bp: LogicalBreakpoint;
  index: number;
  x: number;
  y: number;
  extended: boolean;
} {
  return {
    extended: (header & HEADER_EXTENDED) !== 0,
    bp: BP_FROM_INDEX[(header >> 13) & 0x3]!,
    index: (header >> 8) & 0x1f,
    x: (header >> 4) & 0xf,
    y: header & 0xf,
  };
}

function packChange(
  change: LayoutChange,
  baselineItem: NonNullable<DecodedLayouts["lg"]>[number],
): number[] {
  const x = Math.round(change.fields.x ?? baselineItem.x);
  const y = Math.round(change.fields.y ?? baselineItem.y);
  const hasWH = change.fields.w !== undefined || change.fields.h !== undefined;
  const header = packChangeHeader(change.bp, change.index, x, y, hasWH);
  const bytes = [header & 0xff, header >> 8];

  if (hasWH) {
    let flags = 0;
    if (change.fields.w !== undefined) flags |= FLAG_W;
    if (change.fields.h !== undefined) flags |= FLAG_H;
    bytes.push(flags);
    if (change.fields.w !== undefined) {
      bytes.push(toCenti(change.fields.w));
    }
    if (change.fields.h !== undefined) {
      bytes.push(toCenti(change.fields.h));
    }
  }

  return bytes;
}

function unpackChange(
  reader: ByteReader,
  baselineItem: NonNullable<DecodedLayouts["lg"]>[number],
): LayoutChange {
  const header = reader.readU16LE();
  const { bp, index, x, y, extended } = unpackChangeHeader(header);
  const fields: ItemFieldDelta = {};

  if (x !== baselineItem.x) fields.x = x;
  if (y !== baselineItem.y) fields.y = y;

  if (extended) {
    const flags = reader.readU8();
    if (flags & FLAG_W) {
      fields.w = fromCenti(reader.readU8());
    }
    if (flags & FLAG_H) {
      fields.h = fromCenti(reader.readU8());
    }
  }

  return { bp, index, fields };
}

/** Pack a layout delta to bytes. Returns null when there are no changes. */
export function packLayoutDelta(
  delta: LayoutDelta | null,
  baseline: DecodedLayouts,
): Uint8Array | null {
  if (!delta || delta.length === 0) return null;

  const baselineLogical = getLogicalLayouts(baseline);
  const writer = new ByteWriter();
  writer.pushU8(LAYOUT_DELTA_VERSION);
  writer.pushU8(delta.length);

  for (const change of delta) {
    const baselineItem = baselineLogical[change.bp][change.index];
    if (!baselineItem) {
      throw new Error("Layout delta references unknown baseline item");
    }
    for (const byte of packChange(change, baselineItem)) {
      writer.pushU8(byte);
    }
  }

  return writer.toUint8Array();
}

export function unpackLayoutDelta(
  bytes: Uint8Array<ArrayBufferLike>,
  baseline: DecodedLayouts,
): LayoutDelta {
  const reader = new ByteReader(bytes);
  const version = reader.readU8();
  if (version !== LAYOUT_DELTA_VERSION) {
    throw new Error(`Unsupported layout delta version: ${version}`);
  }

  const changeCount = reader.readU8();
  const baselineLogical = getLogicalLayouts(baseline);
  const delta: LayoutDelta = [];

  for (let i = 0; i < changeCount; i++) {
    const header = reader.readU16LE();
    const { bp, index } = unpackChangeHeader(header);
    const item = baselineLogical[bp][index];
    if (!item) {
      throw new Error("Layout delta references unknown baseline item");
    }

    reader.rewind(2);
    delta.push(unpackChange(reader, item));
  }

  if (reader.remaining !== 0) {
    throw new Error("Trailing bytes in layout delta payload");
  }

  return delta;
}

function assertEncodedLength(encoded: string) {
  if (encoded.length > LAYOUT_DELTA_MAX_ENCODED_LENGTH) {
    throw new LayoutDeltaTooLargeError(encoded.length);
  }
}

/** Encode layout delta as base64url, or null when unchanged. */
export function encodeLayoutParam(
  current: DecodedLayouts,
  baseline: DecodedLayouts,
  activeBreakpoint?: string,
): string | null {
  const delta = diffLayouts(current, baseline, activeBreakpoint);
  const bytes = packLayoutDelta(delta, baseline);
  if (!bytes) return null;
  const encoded = base64urlToBytes.encode(new Uint8Array(bytes));
  assertEncodedLength(encoded);
  return encoded;
}

/** Decode base64url layout param against tab/page baseline. */
export function decodeLayoutParam(
  encoded: string,
  baseline: DecodedLayouts,
): DecodedLayouts {
  const bytes = new Uint8Array(base64urlToBytes.decode(encoded));
  const delta = unpackLayoutDelta(bytes, baseline);
  return applyLayoutDelta(delta, baseline);
}

export function decodeLayoutParamSafe(
  encoded: string,
  baseline: DecodedLayouts,
): DecodedLayouts | null {
  try {
    return decodeLayoutParam(encoded, baseline);
  } catch {
    return null;
  }
}
