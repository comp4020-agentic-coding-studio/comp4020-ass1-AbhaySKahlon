// The sky-to-space gradient, generated from the same visual position used to
// size the journey's scroll legs (see journey.ts) rather than one hand-picked
// colour per milestone. Keyframes are the only hand-authored part; every
// section's actual top/bottom colour is interpolated between them.

interface ColorKeyframe {
  position: number; // 0 = Earth, 1 = Moon, same scale as toVisualPosition
  rgb: [number, number, number];
}

const KEYFRAMES: ColorKeyframe[] = [
  { position: 0.0, rgb: [111, 182, 224] }, // Earth: sky blue
  { position: 0.15, rgb: [66, 140, 195] }, // troposphere
  { position: 0.28, rgb: [35, 90, 150] }, // stratosphere / mesosphere
  { position: 0.355, rgb: [20, 55, 95] }, // the last moment of blue sky
  { position: 0.36, rgb: [5, 10, 22] }, // the Kármán line: sky flips to space here
  { position: 0.52, rgb: [3, 6, 16] }, // low Earth orbit
  { position: 0.76, rgb: [2, 3, 10] }, // Van Allen belts / deep space
  { position: 0.95, rgb: [10, 10, 12] }, // Moon approach
  { position: 1.0, rgb: [107, 107, 112] }, // lunar surface
];

function toHex([r, g, b]: [number, number, number]): string {
  const channel = (value: number) => Math.round(value).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export function colorAt(position: number): string {
  const clamped = Math.min(Math.max(position, 0), 1);
  let lower = KEYFRAMES[0];
  let upper = KEYFRAMES[KEYFRAMES.length - 1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (clamped >= KEYFRAMES[i].position && clamped <= KEYFRAMES[i + 1].position) {
      lower = KEYFRAMES[i];
      upper = KEYFRAMES[i + 1];
      break;
    }
  }
  const span = upper.position - lower.position;
  const t = span === 0 ? 0 : (clamped - lower.position) / span;
  const mixed: [number, number, number] = [
    lower.rgb[0] + (upper.rgb[0] - lower.rgb[0]) * t,
    lower.rgb[1] + (upper.rgb[1] - lower.rgb[1]) * t,
    lower.rgb[2] + (upper.rgb[2] - lower.rgb[2]) * t,
  ];
  return toHex(mixed);
}
