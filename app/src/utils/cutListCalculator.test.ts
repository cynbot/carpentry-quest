import { describe, it, expect } from 'vitest';
import { parseLength, formatLength, calculateCutPlan, type Cut } from './cutListCalculator';

const cut = (length: number, quantity: number, label = ''): Cut => ({
  id: `${label || length}-${quantity}`,
  length,
  quantity,
  label,
});

describe('parseLength', () => {
  it('parses feet-inches and plain inches', () => {
    expect(parseLength('8-2')).toBe(98);
    expect(parseLength(`8'2"`)).toBe(98);
    expect(parseLength('98')).toBe(98);
    expect(parseLength('4-6.5')).toBe(54.5);
  });

  it('rejects garbage', () => {
    expect(parseLength('')).toBeNull();
    expect(parseLength('a board')).toBeNull();
  });
});

describe('formatLength', () => {
  it('formats inches as feet-inches', () => {
    expect(formatLength(98)).toBe(`8'-2.00"`);
    expect(formatLength(96)).toBe(`8'`);
    expect(formatLength(11.5)).toBe(`11.50"`);
  });
});

describe('calculateCutPlan', () => {
  it('accounts for kerf: four 24" cuts need two 96" boards', () => {
    // Without kerf 4 × 24 = 96 fits one board exactly; each 1/8" kerf pushes
    // the fourth cut onto a second board.
    const plan = calculateCutPlan([cut(24, 4)], 96, 0.125);
    expect(plan.totalBoardsNeeded).toBe(2);
  });

  it('fits cuts exactly with zero kerf', () => {
    const plan = calculateCutPlan([cut(24, 4)], 96, 0);
    expect(plan.totalBoardsNeeded).toBe(1);
    expect(plan.totalWaste).toBe(0);
  });

  it('packs longest-first across boards', () => {
    const plan = calculateCutPlan([cut(60, 1, 'long'), cut(30, 2, 'short')], 96, 0);
    expect(plan.totalBoardsNeeded).toBe(2);
    // Longest cut placed first, shorts fill in around it.
    expect(plan.boards[0].cuts[0].cut.label).toBe('long');
  });

  it('reports waste totals that reconcile', () => {
    const plan = calculateCutPlan([cut(40, 3)], 96, 0.125);
    const boardWaste = plan.boards.reduce((sum, b) => sum + b.wasteLength, 0);
    expect(plan.totalWaste).toBeCloseTo(boardWaste, 10);
    expect(plan.wastePercentage).toBeGreaterThan(0);
  });
});
