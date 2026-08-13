// The whole journey is driven from src/data/milestones.json — this module is
// the only place that turns those real distances into visual positions,
// scroll-section sizes and "which milestone is active" decisions. Nothing
// upstream of here should hardcode a distance or a milestone id.

export interface Milestone {
  id: string;
  distanceKm: number;
  distanceLabel: string;
  phase: string;
  title: string;
  description: string;
}

export const MOON_KM = 384_400;

// log10(distanceKm + 1), normalised so Earth (0km) is 0 and the Moon
// (384,400km) is 1. The +1 keeps Earth itself finite (log10(0) is
// undefined) without perceptibly compressing anything else.
const LOG_SCALE = Math.log10(MOON_KM + 1);

export function toVisualPosition(distanceKm: number): number {
  const clamped = Math.min(Math.max(distanceKm, 0), MOON_KM);
  return Math.log10(clamped + 1) / LOG_SCALE;
}

export function toDistanceKm(position: number): number {
  const clamped = Math.min(Math.max(position, 0), 1);
  return 10 ** (clamped * LOG_SCALE) - 1;
}

export function sortedMilestones<T extends { distanceKm: number }>(milestones: T[]): T[] {
  return [...milestones].sort((a, b) => a.distanceKm - b.distanceKm);
}

// The active milestone is the furthest one the visitor has reached: the last
// milestone (in distance order) whose distanceKm is at or before the given
// distance. Ties resolve to the later-listed milestone at that distance.
export function getActiveMilestone<T extends { distanceKm: number }>(
  distanceKm: number,
  milestones: T[],
): T {
  const sorted = sortedMilestones(milestones);
  let active = sorted[0];
  for (const milestone of sorted) {
    if (milestone.distanceKm <= distanceKm) {
      active = milestone;
    } else {
      break;
    }
  }
  return active;
}

export function formatDistanceKm(distanceKm: number): string {
  return `${Math.round(distanceKm).toLocaleString("en-AU")} km`;
}

// One scroll "leg" per milestone, sized by how much visual (log-scaled)
// position separates it from the next milestone — so a compressed span of
// real km (deep space) gets a short leg and an expanded span (the lower
// atmosphere) gets a long one. Clamped so no leg collapses to nothing (two
// milestones sharing a distanceKm) or sprawls unreasonably.
const MIN_LEG_VH = 70;
const MAX_LEG_VH = 260;
const LEG_SCALE_VH = 1200;
const FINAL_LEG_VH = 220;

export function sectionHeightsVh(sorted: { distanceKm: number }[]): number[] {
  return sorted.map((milestone, index) => {
    if (index === sorted.length - 1) return FINAL_LEG_VH;
    const weight =
      toVisualPosition(sorted[index + 1].distanceKm) - toVisualPosition(milestone.distanceKm);
    return Math.min(MAX_LEG_VH, Math.max(MIN_LEG_VH, weight * LEG_SCALE_VH));
  });
}
