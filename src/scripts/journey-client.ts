// Drives the Hud from native scroll position — no scroll-jacking, no
// custom wheel handling. The browser stays in charge of scrolling (mouse,
// trackpad, touch, Page Up/Down, spacebar, arrow keys all keep working);
// this only reads where the viewport ended up and reports it.
import milestonesData from "../data/milestones.json";
import { formatDistanceKm, getActiveMilestone, sortedMilestones, type Milestone } from "../lib/journey";

const milestones = sortedMilestones(milestonesData as Milestone[]);
const sections = Array.from(document.querySelectorAll<HTMLElement>(".stop"));

const distanceValue = document.getElementById("hud-distance-value");
const phaseValue = document.getElementById("hud-phase");
const titleValue = document.getElementById("hud-title");

function currentDistanceKm(): number {
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect();
    if (rect.top <= centerY && rect.bottom >= centerY) {
      const milestone = milestones[i];
      const next = milestones[i + 1];
      if (!next || rect.bottom === rect.top) return milestone.distanceKm;

      const fraction = Math.min(Math.max((centerY - rect.top) / (rect.bottom - rect.top), 0), 1);
      return milestone.distanceKm + fraction * (next.distanceKm - milestone.distanceKm);
    }
  }

  // Above the first section or below the last: clamp to the nearer end.
  const firstRect = sections[0]?.getBoundingClientRect();
  if (firstRect && centerY < firstRect.top) return milestones[0].distanceKm;
  return milestones[milestones.length - 1].distanceKm;
}

function update() {
  const distanceKm = currentDistanceKm();
  const active = getActiveMilestone(distanceKm, milestones);

  if (distanceValue) distanceValue.textContent = formatDistanceKm(distanceKm);
  if (phaseValue) phaseValue.textContent = active.phase;
  if (titleValue) titleValue.textContent = active.title;

  for (const section of sections) {
    section.classList.toggle("is-active", section.id === active.id);
  }
}

let queued = false;
function requestUpdate() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    update();
  });
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
update();
