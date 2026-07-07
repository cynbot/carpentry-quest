/**
 * The Workshop document — Heartwood's single source of truth.
 *
 * Everything the app shows (cut lists, shopping lists, growth rings, and one
 * day the 3D workbench) is a projection of this document. It is designed to be
 * read and written by any collaborator, human or AI — see COLLABORATORS.md.
 *
 * All dimensions are inches unless `units` says otherwise.
 */

export type Units = 'in' | 'mm';

export type MaterialCategory =
  | 'sheet'        // plywood, MDF
  | 'solid'        // hardwood boards
  | 'dimensional'  // 2x4s, fence pickets
  | 'hardware'     // hinges, screws, magnets
  | 'electronics'  // LEDs, boards, speakers
  | 'finish'       // paint, oil, glue
  | 'other';

export interface Material {
  id: string;
  name: string;             // "3/4\" birch plywood"
  category: MaterialCategory;
  stockNote?: string;       // "4x8 sheet", "8-ft lengths"
}

export interface PartDims {
  length: number;           // inches
  width?: number;
  thickness?: number;
  diameter?: number;        // dowels, holes
}

export interface Part {
  id: string;
  name: string;             // "side panel"
  role?: string;            // "leg", "shelf", "lid" — free-form
  materialId?: string;
  dims: PartDims;
  quantity: number;
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice?: number;       // manual for now; live lookups arrive in Phase 2
  url?: string;
  source?: string;          // "Home Depot", "Adafruit", "scrap bin"
  priceAsOf?: string;       // ISO date the price was last true
  acquired: boolean;
}

/** 'human' and 'claude' are conventional; any name is welcome. */
export type Author = 'human' | 'claude' | string;

export interface JournalEntry {
  id: string;
  author: Author;
  text: string;
  createdAt: number;
}

export type ProjectStatus =
  | 'dreaming'
  | 'planning'
  | 'building'
  | 'finished'
  | 'resting';

/** A locked roulette spin that a project grew from. */
export interface RouletteSeed {
  material: string;
  form: string;
  technique: string;
  twist: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  dreamId?: string;         // which Grove dream this feeds
  parts: Part[];
  materials: Material[];
  shopping: ShoppingItem[];
  journal: JournalEntry[];
  seed?: RouletteSeed;
  createdAt: number;
  updatedAt: number;
}

/** A long-horizon dream in the Grove. Rings = finished projects feeding it. */
export interface Dream {
  id: string;
  name: string;             // "Tree farm on 100 acres"
  description?: string;
  emoji?: string;
  createdAt: number;
}

export interface Tool {
  id: string;
  name: string;             // "japanese pull saw"
  category?: string;        // "hand tool", "power tool", "electronics"
  notes?: string;
}

export interface ScrapItem {
  id: string;
  material: string;         // "cedar picket offcut"
  dims?: string;            // free-form: "3 pieces ~2' each"
  quantity: number;
  notes?: string;
}

export interface Workshop {
  schemaVersion: 1;
  units: Units;
  projects: Project[];
  dreams: Dream[];
  tools: Tool[];
  scrap: ScrapItem[];
}

export function emptyWorkshop(): Workshop {
  return {
    schemaVersion: 1,
    units: 'in',
    projects: [],
    dreams: [],
    tools: [],
    scrap: [],
  };
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  dreaming: '💭 Dreaming',
  planning: '📐 Planning',
  building: '🔨 Building',
  finished: '✨ Finished',
  resting: '🍂 Resting',
};
