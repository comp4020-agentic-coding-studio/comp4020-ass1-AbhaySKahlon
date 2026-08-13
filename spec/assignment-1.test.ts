import { describe, expect, it } from "vitest";
import milestones from "../src/data/milestones.json";
import {
  getActiveMilestone,
  sortedMilestones,
  toDistanceKm,
  toVisualPosition,
} from "../src/lib/journey";

// The brief's checkable line: "the visitor does something that changes what
// they see — state the core interaction plainly enough to write a test for
// it." The core interaction is scrolling, and scroll position maps to journey
// distance, which maps to an active milestone. These tests assert that
// contract — distance in, active milestone out — not the DOM or CSS that
// happens to render it, so they survive any redesign of the page itself.

describe("the distance scale is honest and non-linear", () => {
  it("round-trips Earth and the Moon's real distance", () => {
    expect(toDistanceKm(toVisualPosition(0))).toBeCloseTo(0, 5);
    expect(toDistanceKm(toVisualPosition(384_400))).toBeCloseTo(384_400, 1);
  });

  it("gives the same 100km near Earth far more visual room than the same 100km deep in space", () => {
    const nearGap = toVisualPosition(100) - toVisualPosition(0);
    const farGap = toVisualPosition(300_100) - toVisualPosition(300_000);
    expect(nearGap).toBeGreaterThan(farGap * 10);
  });
});

describe("as the journey distance changes, the active milestone changes", () => {
  it("starts at Earth", () => {
    expect(getActiveMilestone(0, milestones).id).toBe("earth");
  });

  it("is in the orbit phase around 300km (low Earth orbit)", () => {
    expect(getActiveMilestone(300, milestones).phase).toBe("Orbit");
  });

  it("reaches the inner Van Allen belt around 3,000km", () => {
    expect(getActiveMilestone(3_000, milestones).title).toMatch(/van allen/i);
  });

  it("arrives at the Moon at 384,400km", () => {
    expect(getActiveMilestone(384_400, milestones).id).toBe("moon");
  });

  it("never regresses to an earlier milestone as distance only increases", () => {
    const order = sortedMilestones(milestones).map((m) => m.id);
    const checkpoints = [0, 50, 100, 400, 3_000, 17_500, 100_000, 384_400];
    const positions = checkpoints.map((d) => order.indexOf(getActiveMilestone(d, milestones).id));

    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThanOrEqual(positions[i - 1]);
    }
  });
});
