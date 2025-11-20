/**
 * Cut List Calculator Utilities for Carpentry Quest
 * Helps calculate material needs and optimize cuts
 */

export interface Cut {
  id: string;
  length: number; // in inches
  quantity: number;
  label?: string;
}

export interface CutPlan {
  boardLength: number; // in inches
  cuts: Cut[];
  sawKerf: number; // blade width in inches (typically 1/8")
  boards: BoardCut[];
  totalBoardsNeeded: number;
  totalWaste: number;
  wastePercentage: number;
}

export interface BoardCut {
  boardNumber: number;
  cuts: Array<{
    cut: Cut;
    position: number; // starting position on board
  }>;
  remainingLength: number;
  wasteLength: number;
}

/**
 * Convert feet-inches string to total inches
 * Examples: "8'2\"", "8-2", "8' 2\"", "98"
 */
export function parseLength(input: string): number | null {
  input = input.trim().replace(/"/g, '').replace(/'/g, '-');

  // Check for feet-inches format
  const feetInchesMatch = input.match(/^(\d+)[\s\-](\d+(?:\.\d+)?)$/);
  if (feetInchesMatch) {
    const feet = parseInt(feetInchesMatch[1]);
    const inches = parseFloat(feetInchesMatch[2]);
    return feet * 12 + inches;
  }

  // Check for just inches
  const inchesMatch = input.match(/^(\d+(?:\.\d+)?)$/);
  if (inchesMatch) {
    return parseFloat(inchesMatch[1]);
  }

  return null;
}

/**
 * Format inches to feet-inches string
 */
export function formatLength(inches: number): string {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;

  if (feet === 0) {
    return `${remainingInches.toFixed(2)}"`;
  }

  if (remainingInches === 0) {
    return `${feet}'`;
  }

  return `${feet}'-${remainingInches.toFixed(2)}"`;
}

/**
 * Calculate optimal cut plan
 * Uses a greedy algorithm to fit cuts into boards
 */
export function calculateCutPlan(
  cuts: Cut[],
  boardLength: number,
  sawKerf: number = 0.125 // default 1/8" kerf
): CutPlan {
  const boards: BoardCut[] = [];
  let currentBoard: BoardCut | null = null;

  // Sort cuts by length (longest first) for better optimization
  const sortedCuts = [...cuts].sort((a, b) => b.length - a.length);

  // Expand cuts by quantity
  const expandedCuts: Cut[] = [];
  sortedCuts.forEach((cut) => {
    for (let i = 0; i < cut.quantity; i++) {
      expandedCuts.push({ ...cut, quantity: 1 });
    }
  });

  // Try to fit each cut
  for (const cut of expandedCuts) {
    let placed = false;

    // Try to fit in current board
    if (currentBoard) {
      const spaceNeeded = cut.length + sawKerf;
      if (currentBoard.remainingLength >= spaceNeeded) {
        const position = boardLength - currentBoard.remainingLength;
        currentBoard.cuts.push({ cut, position });
        currentBoard.remainingLength -= spaceNeeded;
        placed = true;
      }
    }

    // Start new board if not placed
    if (!placed) {
      if (currentBoard) {
        currentBoard.wasteLength = currentBoard.remainingLength;
        boards.push(currentBoard);
      }

      const position = 0;
      currentBoard = {
        boardNumber: boards.length + 1,
        cuts: [{ cut, position }],
        remainingLength: boardLength - cut.length - sawKerf,
        wasteLength: 0,
      };
    }
  }

  // Add last board
  if (currentBoard) {
    currentBoard.wasteLength = currentBoard.remainingLength;
    boards.push(currentBoard);
  }

  // Calculate totals
  const totalBoardsNeeded = boards.length;
  const totalWaste = boards.reduce((sum, board) => sum + board.wasteLength, 0);
  const totalMaterialUsed = totalBoardsNeeded * boardLength;
  const wastePercentage = (totalWaste / totalMaterialUsed) * 100;

  return {
    boardLength,
    cuts,
    sawKerf,
    boards,
    totalBoardsNeeded,
    totalWaste,
    wastePercentage,
  };
}

/**
 * Common board lengths in inches
 */
export const COMMON_BOARD_LENGTHS = [
  { feet: 8, inches: 96 },
  { feet: 10, inches: 120 },
  { feet: 12, inches: 144 },
  { feet: 14, inches: 168 },
  { feet: 16, inches: 192 },
  { feet: 20, inches: 240 },
];

/**
 * Common saw kerf widths
 */
export const COMMON_SAW_KERFS = [
  { name: 'Thin Kerf (1/16")', inches: 0.0625 },
  { name: 'Standard (1/8")', inches: 0.125 },
  { name: 'Thick Blade (3/16")', inches: 0.1875 },
];
