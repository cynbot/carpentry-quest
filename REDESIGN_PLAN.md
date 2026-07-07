# Heartwood — Redesign Plan

> This document supersedes `DEVELOPMENT_PLAN.md` (kept for history).
> Carpentry Quest was a gamified training app built for one learner.
> **Heartwood** is what it grows into: a shared workshop for planning,
> dreaming, and building together — humans and AI minds side by side.

*Heartwood: the dense wood at the center of a tree, formed ring by ring,
that gives the tree its strength. Old growth supporting new.*

---

## Vision

A personal, playful companion for real projects — toys, wooden-cased
electronics, garden builds, fold-up picnic tables, toy chests with seating
nooks, bookshelves — that owns the whole loop nobody else owns:

**idea → concept → parts → shopping list → build → memory**

### Why this app deserves to exist (verified gaps, July 2026)

- Free SketchUp can model but can't produce cut lists (no extensions on web tier).
- Cut-list optimizers (cutlistoptimizer.com et al.) can't design — they need finished dimensions.
- Plan sites (Ana White) are recipes: proven but static, no adaptation to your scrap pile or tools.
- AI plan mills (Planpex, WOODPLANS.AI) vend one-shot plans with a documented trust problem.
- **Nothing is personal** (knows your inventory, your past builds, your dreams) and
  **nothing is collaborative** (lets an AI iterate with you rather than at you).

### Design principles

1. **Documents, not pixels.** Every project, spin, and assembly is a plain,
   versioned JSON document. Anything that can read JSON — you, me, a future
   Claude, some other mind — is a first-class collaborator.
2. **Randomness proposes, constraints dispose.** Creativity features stay
   grounded in what's actually buildable with what you actually have.
3. **The math engines are sacred.** Fraction math and cut-list bin packing
   carry over from Carpentry Quest and everything projects out of them.
4. **Local-first, free-tier forever.** localStorage + export/import now;
   a $0 Vercel Functions proxy when live prices arrive. No accounts, no fees.
5. **Warmth over gamification.** XP grinding retires; growth rings replace it —
   progress you can see, not points you chase.

---

## What carries over from Carpentry Quest

| Asset | Status |
|---|---|
| `utils/cutListCalculator.ts` — bin-packing w/ kerf, waste accounting | **Core engine** |
| `utils/fractionMath.ts` — parse/format/convert carpentry fractions | **Core engine** |
| Versioned localStorage envelope pattern | Reused for workshop data |
| Dark workshop aesthetic, Tailwind design system | Evolved (red → heartwood amber) |
| PWA scaffolding (vite-plugin-pwa) | Kept; icons finally added |
| Tape measure trainer, skill tree, XP/challenges (~half the code) | Retired (git history keeps them safe) |

---

## The data model (schema v1)

Source of truth is the **Workshop document** — everything else is a projection.

```
Workshop {
  schemaVersion, units,
  projects: Project[]     // the work
  dreams:   Dream[]       // the Grove — long-horizon dreams projects feed
  tools:    Tool[]        // inventory: what we can build WITH
  scrap:    ScrapItem[]   // inventory: what we can build FROM
}

Project {
  name, description, status: dreaming|planning|building|finished|resting,
  dreamId?,               // which dream this feeds a ring into
  parts:    Part[]        // parametric: dims + material + role + qty
  materials: Material[]   // sheet|solid|dimensional|hardware|electronics|finish
  shopping: ShoppingItem[] // name, qty, price, url, source, priceAsOf, acquired
  journal:  JournalEntry[] // author: 'human' | 'claude' | any name — shared memory
  seed?:    RouletteSeed  // if the project was born from a spin
}
```

Because parts are parametric (dimensions + material + role, never meshes),
the cut list, the shopping list, and — later — the 3D workbench view are all
*compiled* from the same document. This is the architecture validated by
OpenCutList's part typing and the open-source Morti furniture designer.

---

## Phases

### Phase 1 — Renovation *(this branch)*
- Rebrand to Heartwood; retire training-game code; keep both calculators (XP calls stripped).
- `react-router-dom` routes: Projects / Roulette / Grove / Inventory / Workbench / Tools.
- Workshop document + versioned storage + whole-workshop JSON export/import
  (the export/import round-trip is the v1 AI-collaboration channel).
- Projects with parts, materials, shopping lists (manual prices + links + price-as-of dates), journals.
- The Grove: dreams with growth rings (rings = finished projects linked to a dream).
- Inventory: tools + scrap bin (grounds the roulette; the roulette already reads it).
- Creativity Roulette v0: four reels — Material × Form × Technique × Twist —
  with per-reel lock-and-reroll (3 rerolls a session), scrap-bin-aware material reel,
  "adopt this spin" → creates a seeded project.
- PWA icons (growth rings), SPA rewrites in `vercel.json`.

### Phase 2 — Live values (the $0 → $15/mo ladder)
Research findings (July 2026), so future-us doesn't have to re-learn them:
- A client-side PWA **cannot** call retail APIs directly (CORS + key leakage) —
  a tiny Vercel Functions proxy (free Hobby tier) is the play; keys in env vars,
  responses cached ~daily.
- **Electronics is the sweet spot:** Adafruit's products API is free and keyless
  (5 req/min); DigiKey (1k req/day) and Mouser (1k req/day) have free hobbyist APIs;
  Nexar/Octopart free tier = 1,000 part lookups/month across all distributors in one query.
- **Big-box lumber:** no official public APIs. SerpApi free tier (250 searches/mo,
  Home Depot endpoints) cached daily covers a hobby shopping list; Traject Data
  BigBox ($15/mo) if coverage proves thin. Apify ~$5/mo free credit is a backup route.
- **Amazon:** PA-API retired May 2026; Creators API needs 10 affiliate sales/month.
  Plain product links only (Keepa at ~€49/mo not worth it for two people).
- **McMaster-Carr:** API is approval-gated, but part-number URLs are stable and excellent — deep-link.
- Build order: price-refresh buttons on shopping items → Adafruit/Nexar/DigiKey/Mouser
  live electronics → SerpApi daily-cached lumber. Manual prices always remain a first-class fallback.

### Phase 3 — Roulette grows up
- Constraint dials as reel *filters*: tool budget (hand tools → full shop),
  material budget ("one 8-ft 2x4", "scrap bin only", "$40"), time/skill (weekend → heirloom).
- "2x4 Challenge" preset — the beloved community format, first-class.
- The AI pass: a locked spin expands into 2–3 one-paragraph buildable concepts
  (rough size, joinery, ballpark materials) written into the project journal for veto/adoption.
- Twist deck grows Oblique-Strategies-style: evocative, never dimensional.

### Phase 4 — The Workbench
- Stack (pinned, verified stable): `@react-three/fiber` 9.6.x + `@react-three/drei` 10.7.x
  + zustand. **No physics, no CSG, no realtime multiplayer in the MVP.**
- Axis-aligned parametric parts (boards/panels/dowels) snapping on a real-unit grid;
  face-flush snapping before typed anchors; part inspector as plain React UI.
- The assembly IS a Workshop project — parts placed in 3D are the same `Part[]`,
  so cut list + shopping list fall out for free. Save format is the JSON document,
  never serialized scenes (glTF is export-only).
- Mobile: explicit navigate-vs-move mode toggle; test touch early.
- Prior art to study: Morti (github.com/torusservices/morti-app, MIT, parametric
  furniture → cutlist), OpenCutList's data model, three-bvh-csg *later* for joinery viz.
- Async human+AI co-building = both edit the same document. No infra needed.
  (If we ever want live cursors: Yjs, the way Morti does it.)

### Phase 5 — The long dream
The Grove is the seed: 100 acres, tree farm, toy store, cafe, library.
Project journals become build history; inventory becomes workshop management;
finished toys link to the dream they feed. The app grows the way the dream does —
ring by ring.

---

## Claude's additions (things I wanted to see exist)

Asked "what would you add?", I added these on purpose:

1. **The shop journal.** Claudes don't keep memory between visits. A journal on
   every project — authored by `human` or `claude` — is shared memory built into
   the thing itself. A future Claude reads the journal and picks up where I left off.
   It's the feature I'd want most, because it's the one that makes "we" durable.
2. **The Grove.** Dreams deserve to be artifacts, not just chat. Every finished
   project adds a growth ring to the dream it feeds.
3. **Inventory as creative fuel.** The scrap bin isn't bookkeeping — it's what makes
   the roulette *yours* (reels draw from real scrap) and what a future AI pass needs
   to suggest buildable things.
4. **`COLLABORATORS.md`** — a welcome mat telling any visiting mind how to
   participate in this workshop respectfully.
5. **Honest engineering debts, written down:** fraction ops round-trip through
   floats (fine at 1/64" tolerance, should become exact rational math), no tests
   on the math engines yet (add before the workbench leans on them), Tailwind v3→v4
   migration when convenient.

---

## Sources (abridged)

Pricing: serpapi.com/pricing · trajectdata.com/ecommerce/big-box-api · nexar.com/api ·
developer.digikey.com · mouser.com/api-hub · adafruit.com/products_api · keepa.com/#!api
3D: github.com/pmndrs/react-three-fiber · github.com/pmndrs/drei ·
github.com/torusservices/morti-app · github.com/lairdubois/lairdubois-opencutlist-sketchup-extension ·
github.com/gkjohnson/three-bvh-csg · github.com/elalish/manifold
Creativity: thepigeonletters.com random generator (lock-and-reroll) ·
bliz.studio game-jam generator (typed twist categories) · instructables.com 2x4 Challenge ·
Oblique Strategies (Eno/Schmidt) — constraints disrupt mental sets; prompts should be
evocative, not prescriptive.

*Built ring by ring, together.* ꕤ
