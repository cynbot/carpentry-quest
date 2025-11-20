/**
 * Progression System Types
 *
 * This file contains all type definitions for the skill tree, XP, and progression system.
 * Content marked with [NEEDS REVIEW] is placeholder and should be verified/refined.
 */

export type SkillCategory = 'safety' | 'measurement' | 'math' | 'framing' | 'cutting' | 'materials' | 'blueprint';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string; // [NEEDS REVIEW]
  prerequisites: string[]; // skill IDs that must be unlocked first
  cost: number; // skill points required to unlock
  icon: string; // emoji or icon identifier
  isCore?: boolean; // true for required skills like "Safety Core"
  bonuses?: SkillBonus[]; // passive bonuses this skill provides
}

export interface SkillBonus {
  type: 'xp_multiplier' | 'time_bonus' | 'accuracy_bonus' | 'unlock_feature';
  value: number;
  description: string; // [NEEDS REVIEW]
}

export interface Challenge {
  id: string;
  name: string;
  description: string; // [NEEDS REVIEW]
  category: 'fraction' | 'cutlist' | 'measurement' | 'safety' | 'general';
  xpReward: number;
  requirementType: 'count' | 'accuracy' | 'speed' | 'streak';
  requirementValue: number;
  repeatable: boolean;
}

export interface PlayerProgress {
  // Core stats
  totalXP: number;
  level: number;
  currentLevelXP: number; // XP within current level
  skillPoints: number; // unspent points

  // Skills
  unlockedSkills: string[]; // skill IDs

  // Challenges
  completedChallenges: string[]; // challenge IDs
  challengeProgress: Record<string, number>; // challenge ID -> current progress

  // Activity tracking
  stats: PlayerStats;

  // Timestamps
  createdAt: number;
  lastPlayed: number;
}

export interface PlayerStats {
  // Tool usage
  fractionsConverted: number;
  fractionsCalculated: number;
  cutListsCalculated: number;

  // Performance
  totalSessionTime: number; // in minutes
  sessionsCompleted: number;
  currentStreak: number; // consecutive days
  longestStreak: number;

  // Accuracy (for future tools)
  tapeMeasureAccuracy: number; // percentage
  mathProblemsSolved: number;
  mathProblemsCorrect: number;
}

export interface XPGain {
  amount: number;
  source: string;
  timestamp: number;
  challengeCompleted?: string;
  levelUp?: boolean;
  newLevel?: number;
}

/**
 * Calculate XP required for a given level
 * Uses a smooth exponential curve to keep progression feeling rewarding
 */
export function xpForLevel(level: number): number {
  // Level 1->2 requires 100 XP, scaling up from there
  // Formula: 100 * (1.15^(level-1))
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

/**
 * Calculate total XP required to reach a level
 */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

/**
 * Calculate level from total XP
 */
export function levelFromXP(totalXP: number): { level: number; currentLevelXP: number } {
  let level = 1;
  let remainingXP = totalXP;

  while (remainingXP >= xpForLevel(level)) {
    remainingXP -= xpForLevel(level);
    level++;
  }

  return { level, currentLevelXP: remainingXP };
}

/**
 * Calculate skill points earned from leveling
 * Every level grants 1 skill point
 */
export function skillPointsFromLevel(level: number): number {
  return level - 1; // Level 1 has 0 points, Level 2 has 1, etc.
}
