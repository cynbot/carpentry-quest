/**
 * Persistence for the Workshop document.
 *
 * localStorage now; the same JSON round-trips through export/import, which is
 * also the v1 channel for AI collaborators (see COLLABORATORS.md).
 */

import { emptyWorkshop, type Workshop } from '../types/workshop';

const STORAGE_KEY = 'heartwood-workshop';

export function loadWorkshop(): Workshop {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyWorkshop();
    const parsed: unknown = JSON.parse(raw);
    const validated = validateWorkshop(parsed);
    if (!validated) {
      console.warn('Stored workshop failed validation; starting fresh (old data left in place).');
      return emptyWorkshop();
    }
    return migrate(validated);
  } catch (err) {
    console.error('Failed to load workshop:', err);
    return emptyWorkshop();
  }
}

export function saveWorkshop(workshop: Workshop): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workshop));
  } catch (err) {
    console.error('Failed to save workshop:', err);
  }
}

export function exportWorkshop(workshop: Workshop): string {
  return JSON.stringify(workshop, null, 2);
}

/** Returns the imported workshop, or an error message string. */
export function importWorkshop(json: string): Workshop | { error: string } {
  try {
    const parsed: unknown = JSON.parse(json);
    const validated = validateWorkshop(parsed);
    if (!validated) return { error: 'That JSON is not a Heartwood workshop document.' };
    return migrate(validated);
  } catch {
    return { error: 'Could not parse that file as JSON.' };
  }
}

/**
 * Shape validation, deliberately lenient: required arrays must be arrays,
 * schemaVersion must be a known number. Collaborator-authored documents get
 * the benefit of the doubt on optional fields.
 */
function validateWorkshop(data: unknown): Workshop | null {
  if (typeof data !== 'object' || data === null) return null;
  const w = data as Record<string, unknown>;
  if (typeof w.schemaVersion !== 'number' || w.schemaVersion > 1) return null;
  for (const key of ['projects', 'dreams', 'tools', 'scrap'] as const) {
    if (w[key] !== undefined && !Array.isArray(w[key])) return null;
  }
  return {
    schemaVersion: 1,
    units: w.units === 'mm' ? 'mm' : 'in',
    projects: (w.projects as Workshop['projects']) ?? [],
    dreams: (w.dreams as Workshop['dreams']) ?? [],
    tools: (w.tools as Workshop['tools']) ?? [],
    scrap: (w.scrap as Workshop['scrap']) ?? [],
  };
}

/** One migration function per schema bump, applied in order. None yet. */
function migrate(workshop: Workshop): Workshop {
  return workshop;
}
