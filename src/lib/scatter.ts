// Deterministic (not Math.random) placement for decorative encounter icons,
// so the same milestone always lays out the same way — no layout shift
// between builds, and no risk of two icons landing exactly on top of
// each other by chance the way real randomness could.

export interface ScatterPoint {
  leftPercent: number;
  topPercent: number;
  sizePx: number;
  flip: 1 | -1;
}

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

export interface ScatterBand {
  left: [number, number];
  top: [number, number];
}

const DEFAULT_BAND: ScatterBand = { left: [6, 90], top: [10, 72] };

export function scatterFor(seed: string, index: number, band: ScatterBand = DEFAULT_BAND): ScatterPoint {
  const n = hash(`${seed}:${index}`);
  const [leftMin, leftMax] = band.left;
  const [topMin, topMax] = band.top;
  const leftPercent = leftMin + (n % 1000) / 1000 * (leftMax - leftMin);
  const topPercent = topMin + ((n >>> 10) % 1000) / 1000 * (topMax - topMin);
  const sizePx = 22 + ((n >>> 20) % 3) * 7;
  const flip: 1 | -1 = (n & 1) === 1 ? -1 : 1;
  return { leftPercent, topPercent, sizePx, flip };
}
