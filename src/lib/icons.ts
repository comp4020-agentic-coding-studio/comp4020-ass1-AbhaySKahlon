// One small line-icon per encounter "kind" so the journey's decorative
// layer (see EncounterField.astro) stays visually coherent — same stroke
// weight, same viewBox, no unrelated imagery. Purely decorative: every icon
// is paired with a real text label already rendered in the section's
// encounter list, so nothing here is the only carrier of information.

export interface IconDef {
  viewBox: string;
  markup: string;
}

const LINE: Omit<IconDef, "markup"> = { viewBox: "0 0 24 24" };

export const ICONS: Record<string, IconDef> = {
  dot: { ...LINE, markup: '<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>' },
  cloud: {
    ...LINE,
    markup: '<path d="M6 17a4 4 0 0 1 .3-8 5 5 0 0 1 9.4-1.5A4.5 4.5 0 0 1 18 17H6z"/>',
  },
  bird: { ...LINE, markup: '<path d="M2 15c3-5 7-5 10 0 3-5 7-5 10 0"/>' },
  insect: {
    ...LINE,
    markup: '<circle cx="12" cy="14" r="3"/><path d="M12 11V7M9 8l-2-2M15 8l2-2"/>',
  },
  aircraft: {
    ...LINE,
    markup: '<path d="M2 13l9-2 3-7 2 1-2 6 6 1v2l-6 1 1 5-2 1-2-5-9-1z"/>',
  },
  balloon: {
    ...LINE,
    markup: '<circle cx="12" cy="9" r="6"/><path d="M9 15l-1 4h8l-1-4"/>',
  },
  layer: { ...LINE, markup: '<path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>' },
  spore: {
    ...LINE,
    markup: '<circle cx="9" cy="10" r="1.2"/><circle cx="14" cy="8" r="1"/><circle cx="12" cy="14" r="1.4"/>',
  },
  meteor: { ...LINE, markup: '<path d="M4 20L16 8"/><circle cx="17" cy="7" r="2"/>' },
  boundary: {
    ...LINE,
    markup: '<path d="M3 12h18" stroke-dasharray="3 3"/><path d="M12 12V4M9 7l3-3 3 3"/>',
  },
  satellite: {
    ...LINE,
    markup: '<rect x="9" y="9" width="6" height="6"/><path d="M3 6l4 4M21 6l-4 4M3 18l4-4M21 18l-4-4"/>',
  },
  spacecraft: { ...LINE, markup: '<path d="M12 3l4 6-2 10h-4L8 9z"/>' },
  station: {
    ...LINE,
    markup: '<rect x="10" y="10" width="4" height="4"/><path d="M2 12h6M16 12h6M6 8v8M18 8v8"/>',
  },
  fly: {
    ...LINE,
    markup: '<ellipse cx="12" cy="13" rx="2" ry="3"/><path d="M10 11l-5-3M14 11l5-3"/>',
  },
  dog: {
    ...LINE,
    markup: '<path d="M4 16c0-3 2-5 5-5h2l3-3 2 2-2 2c2 0 4 2 4 4v2H4z"/>',
  },
  mouse: {
    ...LINE,
    markup:
      '<ellipse cx="11" cy="14" rx="5" ry="3.5"/><circle cx="7" cy="9" r="1.6"/><circle cx="10" cy="8" r="1.6"/><path d="M16 15c3 0 4 2 4 4"/>',
  },
  bee: {
    ...LINE,
    markup:
      '<ellipse cx="12" cy="13" rx="4" ry="3"/><path d="M9 11v4M12 10v6M15 11v4"/><ellipse cx="9" cy="8" rx="2.4" ry="1.6"/><ellipse cx="15" cy="8" rx="2.4" ry="1.6"/>',
  },
  spider: {
    ...LINE,
    markup:
      '<circle cx="12" cy="13" r="2.5"/><path d="M12 10.5V6M9.5 12l-5-2M9.5 14l-5 2M14.5 12l5-2M14.5 14l5 2M10.5 15.5l-3 4M13.5 15.5l3 4"/>',
  },
  fish: {
    ...LINE,
    markup:
      '<path d="M3 12c4-4 10-4 14 0-4 4-10 4-14 0z"/><path d="M17 12l4-3v6z"/><circle cx="7" cy="11" r=".6" fill="currentColor" stroke="none"/>',
  },
  tardigrade: {
    ...LINE,
    markup:
      '<ellipse cx="12" cy="12" rx="7" ry="3.2"/><path d="M6 14l-2 2M9 15l-1.5 2.5M12 15.2V18M15 15l1.5 2.5M18 14l2 2"/>',
  },
  "satellite-dead": {
    ...LINE,
    markup: '<rect x="9" y="9" width="6" height="6"/><path d="M3 6l4 4M21 6l-4 4M9 9l6 6"/>',
  },
  "rocket-stage": {
    ...LINE,
    markup: '<rect x="9" y="4" width="6" height="14" rx="2"/><path d="M9 18l-2 4M15 18l2 4"/>',
  },
  fragment: {
    ...LINE,
    markup: '<path d="M6 10l3-3 3 2-1 4-4 1z"/><path d="M15 14l2-2 2 3-3 2z"/>',
  },
  radiation: {
    ...LINE,
    markup:
      '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6" stroke-dasharray="2 3"/><circle cx="12" cy="12" r="10" stroke-dasharray="2 4"/>',
  },
  empty: { ...LINE, markup: '<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>' },
  dust: {
    ...LINE,
    markup:
      '<circle cx="8" cy="10" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r=".6" fill="currentColor" stroke="none"/><path d="M11 15l2-2 2 1-1 3-3-1z"/>',
  },
  wind: {
    ...LINE,
    markup: '<path d="M3 9h12a3 3 0 1 0-3-3"/><path d="M3 15h15a3 3 0 1 1-3 3"/>',
  },
  "moon-glow": {
    ...LINE,
    markup: '<circle cx="12" cy="12" r="7" fill="currentColor" stroke="none" opacity=".8"/>',
  },
  footprint: {
    ...LINE,
    markup:
      '<path d="M12 4c-2 0-3 2-3 4s1 3 1 5-1 4-1 6c0 2 2 3 3 3s3-1 3-3c0-2-1-4-1-6s1-3 1-5-1-4-3-4z"/>',
  },
  lander: {
    ...LINE,
    markup: '<path d="M9 14h6l2 6H7z"/><rect x="10" y="6" width="4" height="8"/><path d="M6 20l2-4M18 20l-2-4"/>',
  },
};
