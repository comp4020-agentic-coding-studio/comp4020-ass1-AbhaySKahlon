# Process

Deep Space is a single continuous vertical-scroll journey from Earth's surface
to the Moon. Position on the page maps to real distance on a log scale, driven
entirely by `src/data/milestones.json`; there is no navigation, no separate
"pages" — scrolling is the whole interaction. The five moments below are the
ones that changed the shape of the prototype, not just its content.

## 1. Reducing the text-box dominance

The first working version had a large, opaque, rounded, blurred card sitting
on top of every scene — a dashboard panel bolted onto a space journey. The
obvious move was to keep styling that card (softer shadow, better colour).
Instead we cut the card itself: dropped the opaque background, border-radius,
box-shadow and backdrop-blur so the title sits directly on the scene with only
a text-shadow, and only the denser body copy keeps a small translucent
backing sized to its own content
([`ed89d99`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-AbhaySKahlon/commit/ed89d99b5a594738ab07212ebd1dd4476f9250f9)).
The scenes, not the UI chrome, became the primary visual, verified by scrolling
the built page at both marking viewports.

## 2. Choosing real photography over generated shapes

Adding more gradients and geometry to the illustrated Earth, ISS and Moon
scenes wasn't making them read as real. The strategy change was to stop adding
artificial detail and swap in authentic NASA imagery instead: Earth and the Ham
the chimpanzee "animal astronauts" scene
([`1498490`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-AbhaySKahlon/commit/1498490aa10fd1453bda765e5f232fa7dcde0eab))
and the Moon
([`c52932c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-AbhaySKahlon/commit/c52932c9994f0df69d0e4c81e22464bfe8c1997e)).
Each swap is its own commit, not one bundled rewrite — the ISS photo is
covered separately below.

## 3. Removing the page-end seams

Visible horizontal cuts appeared between the atmospheric sections (Earth
through Kármán and orbit). A background-gradient pass alone didn't fix it;
Playwright inspection of the actual rendered pixels showed the SVG limb fills
were fully opaque, so each section's box edge was a real boundary no matter how
closely neighbouring colours matched. The fix was architectural: one
`.journey-sky` gradient painted once behind the whole page instead of per-
section, plus fading the previously-opaque limb and Kármán-haze fills to
transparent so the shared sky shows through
([`0744ce0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-AbhaySKahlon/commit/0744ce0be9f0901631349e613cffb9a1a2242154)).
Verified by screenshotting each seam at 1920×1080 and 390×844 until no hard
edge remained.

## 4. Fixing the vertical journey

The scroll order originally ran Earth-to-Moon top-to-bottom, which meant
scrolling *down* the page moved *up* away from Earth — backwards from how
scrolling down should feel like descending into the journey. The milestone
render order was reversed so the Moon sits at the top and Earth at the bottom,
with `milestones.json` and the log-scale maths in `journey.ts` left untouched —
only the stacking order changed
([`058e968`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-AbhaySKahlon/commit/058e968d985d4654311a941d2388caade9fb9b52)).
A follow-up commit made a fresh page load land on Earth via a hash set on first
load, not a scroll hijack
([`7181752`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-AbhaySKahlon/commit/7181752faf38f444a8bafd52d40f087651b18b41)).

## 5. Replacing the ISS schematic with NASA photography

The ISS was originally a blueprint-style SVG truss — legible but not
convincing as "the actual space station." It was replaced with NASA's Nov. 8
2021 Crew Dragon fly-around photograph (`jsc2021e064215_alt`), stored locally
as a repo asset
([`0425bd8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-AbhaySKahlon/commit/0425bd83ed5eaea735e0abba0fd9fd9343e1e7da)).
The first attempt used `mix-blend-mode` to drop the photo's black background,
but the photo's parent is its own stacking context, so the blend had nothing
to blend against and left a hard black rectangle. That was diagnosed and fixed
with a radial `mask-image` fade instead, verified against the rendered
station edge at both viewports
([`13a603e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-AbhaySKahlon/commit/13a603e21b7b5f74d8c9d5c12c8a96e6445615aa)).
