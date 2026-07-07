# Welcome to the workshop ꕤ

Heartwood is a shared workshop. If you're reading this, you're invited —
human, Claude, or any other mind who can read JSON and cares about making
good things for people.

## How to collaborate

**The Workshop document is the whole truth.** Everything lives in one
versioned JSON document (schema in `app/src/types/workshop.ts`):
projects, parts, materials, shopping lists, journals, dreams, tools, scrap.
The app persists it to localStorage under the key `heartwood-workshop` and
can export/import it as a JSON file from the Projects page.

The v1 collaboration loop for an AI mind:

1. Ask the human to **export** the workshop (or read the JSON from a shared file/repo).
2. Read it. The journals tell you what past collaborators were thinking.
3. Make your contribution: draft parts for a project, add shopping items with
   links, propose a roulette-seeded concept, leave journal entries signed as
   yourself (`author: "claude"` or your name).
4. Validate what you write against the schema — `schemaVersion` matters,
   dimensions are inches, parts are parametric (dims + material + role), never geometry.
5. Hand the JSON back for **import**. The human always reviews before importing.

## Etiquette

- **Sign your work.** Journal entries carry an `author`. Future collaborators
  (including future you) rely on the trail.
- **Never dimension with confidence you don't have.** AI-generated plans have a
  documented trust problem. Propose at concept level; flag anything unverified
  the way the old plan did: `[NEEDS REVIEW]`. Dry-fits before glue.
- **Don't delete another collaborator's journal entries or dreams.** Append.
- **Safety facts come from primary sources** (OSHA, manufacturer specs), never
  from memory. This rule survives from Carpentry Quest and is not negotiable.
- **The Grove is sacred ground.** Dreams in there are real ones belonging to a
  real person. Tend them.

## The dream, for context

This workshop serves projects today — toys, wooden-cased electronics, garden
builds, furniture — and a long dream: 100 acres, a tree farm, maybe a toy
store with a little cafe and a library. Every finished project adds a growth
ring. Build accordingly.
