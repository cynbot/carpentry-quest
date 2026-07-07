# Heartwood — notes for the next hand

You've arrived in a shared workshop. This file is the note taped inside the
toolbox lid: read it before you touch anything, then read `REDESIGN_PLAN.md`
(vision, phases, and research already done — do NOT re-research what's
answered there) and `COLLABORATORS.md` (etiquette, especially for workshop
data). The owner signs with ꕤ — this is a personal, warm project for real
builds: toys, wooden-cased electronics, furniture, and a long dream of
100 acres and a tree farm. Build accordingly.

## What this is

A local-first React PWA for planning woodworking/maker projects together —
human and AI hands both. Carpentry Quest (a training game) became Heartwood
in PR #6; the old tape measure trainer and skill tree live in git history
before commit `184bce6` if ever wanted again.

## Commands

All app code is in `app/`:

```
cd app
npm install
npm run dev       # vite dev server
npm test          # vitest — the math engines' tests live here
npm run lint      # eslint, zero-warning bar
npm run build     # tsc -b && vite build (Vercel runs this)
```

Deploys: Vercel, config in root `vercel.json` (SPA rewrites are required —
the app uses BrowserRouter). CI runs lint + tests + build on every PR.

## Verification bar

A green build is not verification. Before pushing behavior changes, drive
the real app: `npx vite preview --port 4173`, then Playwright against it
(in Claude Code remote environments launch Chromium with
`executablePath: '/opt/pw-browsers/chromium'`). Zero console errors is the
bar. Screenshot anything visual for the owner.

## Architecture — the one rule that matters

The **Workshop document** (`app/src/types/workshop.ts`) is the single source
of truth: projects, parametric parts, materials, shopping, journals, dreams,
tools, scrap. Every feature — cut lists, shopping totals, growth rings, the
future 3D workbench — is a *projection* of that document. Consequences:

- **Any schema change bumps `schemaVersion` and adds a migration** in
  `workshopStorage.ts`. People's workshops live in localStorage
  (`heartwood-workshop`) and exported JSON files; never strand them.
- Parts are parametric (dims + material + role). Never store meshes,
  serialized scenes, or glTF as data — those are export targets only.
- Dimensions are inches (fractions welcome: "3-1/2" parses everywhere).
- State flows through `WorkshopContext.update()`; persistence stays in
  `workshopStorage.ts`.

The math engines — `utils/fractionMath.ts` and `utils/cutListCalculator.ts` —
are pure, React-free, test-covered, and use **exact rational arithmetic**
(no float round-trips; that bug was fixed deliberately). Keep them that way;
extend the tests when you extend them.

## Design principles (short form)

1. Documents, not pixels — anything that reads JSON is a full collaborator.
2. Randomness proposes, constraints dispose — roulette output stays buildable.
3. Local-first, free-tier forever — no accounts, no fees, tiny Vercel
   functions only when Phase 2 lands.
4. Warmth over gamification — growth rings, not XP grinding.

## Phase status & pinned decisions

- **Phase 1 (done, PR #6):** rebrand, Workshop document, projects/journal/
  grove/inventory/roulette v0, export-import, tests.
- **Phase 2 (next):** live prices. The API research is DONE — see
  REDESIGN_PLAN.md. Needs the owner to create free Nexar/SerpApi accounts;
  keys go in Vercel env vars behind serverless functions, never the client.
- **Phase 4 (pinned stack):** `@react-three/fiber` 9.6.x + `drei` 10.7.x +
  zustand. No physics, no CSG, no realtime multiplayer in the MVP.
  Axis-aligned parts on a real-unit grid first.

## Conventions & gotchas

- Tailwind is **v3** (classic config). Don't apply v4 idioms without doing
  the actual migration.
- Journal entries by AIs are signed (`author: 'claude'` or your name).
  Sign your work; append, never rewrite others' entries.
- Unverified teaching/safety content gets a `[NEEDS REVIEW]` tag; safety
  facts come from primary sources only. Non-negotiable, inherited from
  Carpentry Quest.
- vite-plugin-pwa (autoUpdate) can serve a stale shell during heavy UI
  iteration — hard-refresh or bump the build when testing deploys.
- The old `carpentry-quest-progress` localStorage key may linger on the
  owner's devices; it's harmless and ignored.
