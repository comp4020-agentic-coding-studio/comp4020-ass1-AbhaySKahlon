# COMP4020 prototype

This is your starter repo for a COMP4020 prototype: a static site written in
HTML/CSS/TypeScript that builds to plain HTML/CSS/JS and deploys to GitHub
Pages. The **deployed site is what gets marked** --- not this repo, and not "it
works on my machine". It's marked live in Chrome against the deployed URL at two
viewports --- 1920×1080 (desktop) and 390×844 (phone) --- and both count in
full, so make that artefact good at both and use the checks below to know
whether it is.

What you're building this week — the spec — is published on the course website,
and this repo's name tells you which deliverable it is. Run the course plugin's
**start** skill at the start of each week: it pulls the right spec from the
course API, carries your harness forward from last week, and helps you turn the
spec's checkable lines into tests of your own. Read the spec before you build,
and see `spec/README.md` for how the checks in this repo relate to it.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Before you push, run `pnpm check`. It runs most of what CI runs --- build,
  lint, and the spec --- so you catch those in seconds instead of waiting for
  the pipeline. The links check, the evidence check, the secrets scan, and the
  deploy itself only run in CI; run `pnpm dlx linkinator ./dist --silent`
  locally against a fresh `pnpm build` for the links check without waiting for
  CI.
- To see what the page actually looks like rather than what you assume it looks
  like, open it in a browser (the `agent-browser` CLI, documented on
  [the course site](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/backpressure/#agent-browser-the-rendered-page-as-ground-truth),
  works well for this). The rendered page is the truth; your mental model of it
  isn't.
- When a check fails, read its output before changing anything. Each check below
  names what it measures, and the failure message is the instruction: it tells
  you the file, the line, or the contract. Treat a red check as authoritative
  --- the page is wrong until the check is green, not until you decide it should
  be.
- Commit when the checks pass. Never commit a red state.

## The checks (your sensors)

CI runs these on every push once your repo is public. GitHub's checks UI shows
two jobs, `check` and `deploy` --- not one status per sensor below --- and
within `check` the steps run in sequence (`pnpm check` chains typecheck, build,
lint, and the spec with `&&`), so an early failure like a broken build stops the
later sensors from running for that push; fix it and push again to see the rest.
While the repo is private (all week, until you ship) the CI jobs stay skipped
--- `pnpm check` is the same roster on your machine, and it's the faster loop
anyway. They aren't hoops. Each is a different way of finding out something true
about the site that you can't reliably see by looking at it.

They also carry a mark at a crit: the sweep runs fifteen minutes after your
cutoff, and green checks there are worth half that week's shipped mark. Still
running counts as not green, so ship with time for CI to finish.

- **typecheck** --- `tsc --noEmit` runs first in `pnpm check`, so a type error
  stops the roster before the build even starts. The types are extra
  backpressure: a red here is the compiler telling you a claim in the code is
  false.
- **build** --- the site must build (`pnpm build`). A build failure means the
  deployed site is broken or stale, so nothing else matters until this is green.
- **deploy / online** --- the live GitHub Pages URL must load and return the
  page you expect. An asset that 404s on the deployed URL counts as broken even
  if it loads locally.
- **spec** --- `spec/invariants.test.ts` asserts what's true of any good
  website, whatever the week's brief asks; the tests you write for the week's
  own spec run alongside it (any `spec/*.test.ts`). A failure names the contract
  you haven't met yet.
- **lint** --- `stylelint` for CSS, `oxlint` for TypeScript. Flags code that's
  wrong, fragile, or non-idiomatic. Read the rule it names.
- **tests** --- any other tests you write, wherever you put them (co-located
  with your source is fine, not just `spec/`), must pass. Vitest picks up both
  this and the spec suite in one `vitest run`, the last step of `pnpm check`. A
  failing test is a claim about the site that's no longer true.
- **evidence** (`pnpm check:evidence`) --- checks your process evidence:
  `PROCESS.md`'s citations resolve to real commits, the current deliverable's
  exact reflection is in `reflections/` (worked out from this repo's name
  against the public course API), and your `CLAUDE.md` is present. Evidence
  gates the deploy --- `deploy` needs `check` to pass, so failing evidence
  blocks the deploy alongside everything else. See
  [Your process is part of the mark](#your-process-is-part-of-the-mark) below,
  and the course website's
  [assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
  for what counts as evidence.
- **links** --- internal links must resolve. A broken link is a dead end you
  didn't mean to ship.
- **secrets** --- the repo is scanned for committed credentials. Never put a
  key, token, or password in a tracked file. If one leaks, rotate it. A local
  pre-commit hook (`.githooks/pre-commit`, installed by `pnpm install`) also
  blocks any commit containing something shaped like an API key --- by the time
  CI sees a key it's already pushed, so the hook is the sensor that matters.

Nothing here measures **accessibility** or **performance** --- wiring those
sensors (`axe-core`, Lighthouse, or whatever you choose) is your work, and later
in the course the spec will ask you to show how you tested both. When you do,
read a green performance result honestly: it's a lab estimate from one run on a
CI machine, not proof the site is fast for real users.

## The stack is swappable

Out of the box this is plain HTML/CSS/TypeScript on Vite, and every `.html` file
in the repo is a page: add pages, link them, and the build picks them up with no
config. That's a default, not a rule (unless the week's spec says otherwise).
You can swap in Astro or any other static generator, because nothing in CI names
a tool --- the whole contract is:

- `pnpm build` emits the complete site into `dist/`
- the `package.json` scripts (`check`, `check:evidence`, `build`) keep working
- whatever lands in `dist/` still passes the invariants in `spec/`

Two things bite in a swap. The deployed site lives under a path
(`…github.io/<repo>/`), so configure your generator's base path --- this
template's Vite config uses relative asset URLs to sidestep that, but most
generators (Astro included) need `base` set explicitly, and getting it wrong
looks fine locally while every asset 404s on the live URL. And commit the
updated `pnpm-lock.yaml`: CI installs with `--frozen-lockfile`.

## Your process is part of the mark

The deployed page is only half of it. How you got there is marked too: your
commit history, your agent files, and the decisions visible across them. The
checks above can't see any of that, so a person reads it directly --- which
means building legibly is part of building well.

- **Commit as you go.** Small, frequent commits are the record of how the work
  came together, and that record is read, not just the final state. A trail that
  grew alongside the code is the strongest evidence of your process; a single
  dump the night before is the weakest.
- **Keep a process overview** (`PROCESS.md`). A short reading-guide, not an
  essay: what you built, the moments that mattered --- each pointing at a
  commit, a `CLAUDE.md` change, or a prompt and the commit it produced --- and
  where to look in the history. It points a marker at the evidence; it doesn't
  stand in for it, and claims the history doesn't back don't count. The
  `PROCESS.md` in this repo is a template showing the shape and the citation
  format (link text the commit hash or range, target the commit or compare URL);
  `pnpm check:evidence` verifies your citations resolve to real commits before
  you ship. Markers follow those citations and don't trawl the repo for evidence
  you didn't cite.
- **Write your reflection in `reflections/`** --- a short markdown file in this
  repo, named for the deliverable it answers, so the number in the filename is
  the number in this repo's name (`crit-1.md` in `comp4020-crit1-<you>`,
  `assignment-1.md` in `comp4020-ass1-<you>`); `reflections/README.md` has the
  full rule. `pnpm check:evidence` checks the exact current name against the
  course API, not merely the presence of any well-named file. It answers the two
  standing prompts: the breakthrough that moved the work forward, and what this
  work changed about the developer you want to be. It stays out of the deployed
  site. It's due at the cutoff, and if it isn't in the repo by then the week
  doesn't count as shipped, however good the prototype is.
- **This file is process evidence.** The harness you build to direct the agent,
  this `CLAUDE.md` and any `AGENTS.md`, is itself read as part of how you
  worked. Keep it honest and current (see below).

You don't need a name, a student number, or any identity file in the repo: we
know whose repo it is. Spend the effort on the work.

## This file is yours

This CLAUDE.md is a starting point, not a fixed rulebook. As you learn what your
prototype needs --- a convention to hold the agent to, a sensor that keeps
catching you out, a fact about the stack the agent keeps getting wrong --- write
it down here. Growing this file is the work of harness engineering, and the gap
between this boilerplate and your own version is part of what your prototype
says about the developer you're becoming.

## This project: Deep Space — Earth to Moon

This is a single continuous vertical-scroll journey from Earth's surface to the
Moon. Scrolling is the entire interaction. There is no navigation between
"pages", no menu of sections to jump around — the point is one honest,
continuous journey, and every change should make that journey clearer, not add
alternative ways to experience it.

- **Scope lock.** This is an Earth-to-Moon vertical journey explainer, not a
  generic space website. Do not add unrelated space content (other planets,
  general astronomy trivia, a "gallery", a quiz) unless it's anchored to a real
  point along the Earth→Moon distance line. If a new idea doesn't have a
  `distanceKm`, it doesn't belong in the journey.
- **The dataset is the source of truth.** `src/data/milestones.json` and
  `src/data/encounters.json` drive the page — section order, section height,
  and the background gradient are all *generated* from `distanceKm` via
  `src/lib/journey.ts` and `src/lib/palette.ts`. Don't hand-tune a section's
  pixel height or color; if something looks wrong, fix the data or the mapping
  function, not the one section that looks off.
- **The scale is logarithmic, and the labels must stay honest.** Visual
  position uses `log10(distanceKm + 1)`, normalised so Earth is 0 and the Moon
  is 1 (see `toVisualPosition` / `toDistanceKm` in `src/lib/journey.ts`). This
  is what makes the first 100km (atmosphere, ISS, Van Allen belts) occupy a
  readable amount of scroll instead of being a rounding error against
  384,400km. Every displayed distance (Hud, section eyebrows) must still show
  the real, linear km value — the log scale is for positioning only, never for
  what the visitor reads as a number.
- **No scroll-jacking.** `src/scripts/journey-client.ts` only *reads* scroll
  position (via `getBoundingClientRect`, rAF-throttled) to update the Hud and
  the active-milestone state. It must never call `scrollTo`, intercept wheel
  events, or otherwise take control of scrolling away from the browser. Native
  scroll (mouse, trackpad, touch, Page Up/Down, arrow keys, spacebar) must keep
  working exactly as it would on any other page.
- **Static, client-side only.** No backend, no build-time data fetching beyond
  the local JSON files. Everything the visitor sees comes from the static
  build plus the one client script.
- **Keep the accessibility invariants true as you extend content.** One `h1`
  (on the Earth section only), `lang` set, a real viewport meta, `header`/
  `nav`/`main` landmarks, visible focus states, no information conveyed by
  color alone (encounters and phases are always labelled in text, not just
  tinted), and `prefers-reduced-motion` respected for the meteor and any future
  animation. These are already true; don't reintroduce a regression while
  adding content.
- **The core interaction has a test, and it must stay a contract test.**
  `spec/assignment-1.test.ts` tests distance → active milestone and the
  non-linearity of the scale, against the pure functions in
  `src/lib/journey.ts` — not the DOM. If you touch the mapping logic, update
  this test's expectations deliberately; don't loosen it to make it pass. Do
  not write new tests that assert exact DOM structure or CSS values.
- **Verify the base path, not just `pnpm dev`.** The deployed site lives under
  `/comp4020-ass1-AbhaySKahlon/` (`astro.config.ts`'s `base`). Currently every
  asset (CSS, the client script) is inlined into `dist/index.html`, so there
  are no separate asset URLs to break — if that ever changes (an image, a
  separate script, a font), check the built `dist/` output under the base
  path, not just the dev server, before considering it done.
- **Commit incrementally.** Commit as each piece of the journey becomes real
  (data layer, then structure, then interaction, then visuals, then each
  content pass) — not as one large commit at the end. The commit history is
  read as part of the process evidence for this assignment.
- **Do not fabricate process evidence.** `PROCESS.md` entries and
  `reflections/assignment-1.md` must only describe things that actually
  happened in this repo's history — no invented breakthroughs or moments that
  didn't occur.
- **Do not make the repo public, deploy to the live Pages URL, run the ship
  process, or change repository visibility** unless explicitly asked. The repo
  stays private during development.

### Visual language (second pass)

The first working version was structurally correct but visually flat — a
sequence of text cards on a colour gradient, not something that felt like
travelling anywhere. The fix wasn't a new architecture, it was a visual layer
added *behind* the existing cards:

- **The scene is the explanation; the card is the caption.** Each section can
  render a background "scene" (`src/components/scenes/*.astro`) and a
  scattered field of small decorative icons (`EncounterField.astro`, driven
  directly by that milestone's `encounters` array — nothing hand-placed) sitting
  behind the sticky `.stop-content` panel. The panel holds real text and must
  stay the accessible source of truth; the scene and the icon field are always
  `aria-hidden="true"` and must never be the *only* place information appears.
  The one exception is `KarmanBanner.astro` at the Kármán line — that's real,
  visible text making 100km a deliberate visual event, not a decoration.
- **Icons are generated from encounter `kind`, not hand-placed per
  milestone.** `src/lib/icons.ts` maps an encounter's `kind` string to a small
  line-icon; `src/lib/scatter.ts` positions it deterministically (hashed, not
  `Math.random`, so layout doesn't shift between builds). Adding a new
  encounter to `encounters.json` is enough to get both a text bullet and a
  matching icon — don't add a one-off `<img>` or inline SVG for a single
  encounter instead of adding an icon to the shared set.
- **Only a handful of milestones get a bespoke scene component**: `earth`
  (horizon/clouds), `karman-line` (the transition banner), `inner-van-allen` /
  `outer-van-allen` (the belts, via `VanAllenField` with a `variant` prop —
  don't create a third component for a third belt that doesn't exist),
  `solar-wind` (particle flow), and `moon-approach` / `moon` (the growing Moon
  disc plus, only at `moon`, the lunar ground). Every other milestone relies on
  `EncounterField` alone. Don't add a bespoke scene for a milestone that
  doesn't need one — that's exactly the over-decoration the spec warned
  against.
- **The Kármán line's blue-to-black flip is intentional palette tuning, not a
  bug.** `src/lib/palette.ts`'s keyframes are deliberately bunched around
  `toVisualPosition(100km)` (~0.36) so the sky visibly flips to space right at
  the boundary instead of fading gradually across low Earth orbit. If the
  milestone data changes, re-check that this transition still lands on the
  Kármán line's position, not somewhere else.
- **All new motion (icon drift, belt-particle pulse, solar wind flow) is
  additive on top of the existing `prefers-reduced-motion` pattern**: gate the
  `animation` declaration inside `@media (prefers-reduced-motion: no-preference)`
  and provide an explicit `animation: none` fallback inside the existing
  `@media (prefers-reduced-motion: reduce)` block, and make sure the static
  (non-animated) composition still reads sensibly on its own — motion is
  garnish, never the only way information is conveyed.
- **Decorative elements must not introduce horizontal scroll or break
  responsiveness.** `.stop` has `overflow: hidden`; keep any new absolutely
  positioned scene content sized in `%`/`vmin`/`vw` with `min()` caps, and add a
  narrower variant in the existing `@media (width <= 640px)` block rather than
  a fixed pixel size that only works on desktop.
