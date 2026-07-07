/**
 * Creativity Roulette reels.
 *
 * Design notes (from the redesign research):
 * - Four reels: MATERIAL x FORM x TECHNIQUE x TWIST, lock-and-reroll.
 * - The TWIST slot does the creative heavy lifting — Oblique-Strategies style:
 *   evocative and interpretive, never dimensional.
 * - Buildability comes from curation and (in Phase 3) constraint dials, plus
 *   grounding the material reel in the actual scrap bin.
 */

export interface RouletteReel {
  key: 'material' | 'form' | 'technique' | 'twist';
  label: string;
  emoji: string;
  pool: string[];
}

export const MATERIAL_POOL = [
  'one 8-ft 2x4, nothing more',
  'cedar fence pickets',
  '3/4" birch plywood',
  '1/4" plywood + paint',
  'the scrap bin only',
  'pallet wood (checked for stamps)',
  'poplar + bright paint',
  'oak offcuts',
  'dowels and canvas',
  'pine + walnut accents',
  'a single 2-ft hardwood board',
  'plywood + something that glows',
];

export const FORM_POOL = [
  'a toy chest',
  'a fold-flat picnic table',
  'a bookshelf',
  'a night-light with a wooden shade',
  'a marble run',
  'a music box',
  'a planter box',
  'a step stool',
  'a box with a secret',
  'a wall shelf',
  'a lantern',
  'a bird house',
  'a toy vehicle',
  'a desk organizer',
  'a garden tool caddy',
  'a reading nook accessory',
];

export const TECHNIQUE_POOL = [
  'box joints',
  'pocket screws',
  'dowel joinery',
  'dado shelves',
  'kerf bending',
  'chamfered edges everywhere',
  'visible splines',
  'wood-burned details',
  'painted patterns',
  'through-tenons you can see',
  'lap joints',
  'no glue — fasteners or friction only',
];

export const TWIST_POOL = [
  'it must fold flat',
  'hide a compartment',
  'no metal fasteners',
  'built for a child’s height',
  'it must nest inside a previous build',
  'honour thy knot',
  'it glows at night',
  'it makes a sound when opened',
  'two materials that argue with each other',
  'finish it in one weekend',
  'it must survive the garden',
  'make two — give one away',
  'it holds exactly one treasured thing',
  'a curve where no one expects one',
  'it should outlive us',
  'the offcuts must become something too',
];

export const REELS: RouletteReel[] = [
  { key: 'material', label: 'Material', emoji: '🪵', pool: MATERIAL_POOL },
  { key: 'form', label: 'Form', emoji: '📦', pool: FORM_POOL },
  { key: 'technique', label: 'Technique', emoji: '🪚', pool: TECHNIQUE_POOL },
  { key: 'twist', label: 'Twist', emoji: '✨', pool: TWIST_POOL },
];

export const REROLLS_PER_SESSION = 3;

export function randomFrom(pool: string[], not?: string): string {
  if (pool.length === 0) return '';
  if (pool.length === 1) return pool[0];
  let pick = pool[Math.floor(Math.random() * pool.length)];
  // Avoid handing back the exact value being rerolled.
  while (pick === not) {
    pick = pool[Math.floor(Math.random() * pool.length)];
  }
  return pick;
}
