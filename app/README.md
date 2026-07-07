# Heartwood ꕤ

A shared workshop for planning, dreaming, and building together — humans and
AI minds side by side. Plan real projects (toys, wooden-cased electronics,
garden builds, furniture) as living documents: parametric parts, cut plans,
shopping lists, shared journals, and long dreams that grow a ring per
finished build.

React 19 · TypeScript · Vite 7 · Tailwind v3 · PWA · localStorage-first

## Run it

```
npm install
npm run dev       # develop
npm test          # vitest suite (math engines)
npm run lint      # eslint
npm run build     # production build (what Vercel runs)
```

## Where things live

- `src/types/workshop.ts` — the Workshop document schema, the single source
  of truth everything else projects from
- `src/utils/` — pure engines: exact fraction math, cut-list bin packing,
  versioned persistence
- `src/pages/` — Projects, Roulette, Grove, Inventory, Workbench, plus the
  standalone calculators in `src/components/`

## The bigger picture

See `../REDESIGN_PLAN.md` for the vision, roadmap, and research, and
`../COLLABORATORS.md` if you're a mind (human or otherwise) who wants to
work in someone's workshop respectfully. `../CLAUDE.md` briefs AI coding
agents landing in this repo.

Built ring by ring, together.
