/**
 * Challenge Data
 *
 * [NEEDS REVIEW] - All challenge descriptions and XP values are placeholders
 * to be balanced and verified during testing.
 */

import type { Challenge } from '../types/progression';

export const CHALLENGES: Record<string, Challenge> = {
  // ===== FRACTION CONVERTER CHALLENGES =====
  'fraction-first-steps': {
    id: 'fraction-first-steps',
    name: 'First Steps',
    description: '[NEEDS REVIEW] Convert your first fraction to decimal.',
    category: 'fraction',
    xpReward: 25,
    requirementType: 'count',
    requirementValue: 1,
    repeatable: false,
  },

  'fraction-apprentice': {
    id: 'fraction-apprentice',
    name: 'Fraction Apprentice',
    description: '[NEEDS REVIEW] Convert 10 fractions.',
    category: 'fraction',
    xpReward: 50,
    requirementType: 'count',
    requirementValue: 10,
    repeatable: false,
  },

  'fraction-calculator': {
    id: 'fraction-calculator',
    name: 'Calculator Master',
    description: '[NEEDS REVIEW] Perform 25 fraction calculations (add, subtract, multiply, divide).',
    category: 'fraction',
    xpReward: 100,
    requirementType: 'count',
    requirementValue: 25,
    repeatable: false,
  },

  'fraction-daily': {
    id: 'fraction-daily',
    name: 'Daily Practice',
    description: '[NEEDS REVIEW] Convert 5 fractions in one day.',
    category: 'fraction',
    xpReward: 20,
    requirementType: 'count',
    requirementValue: 5,
    repeatable: true,
  },

  // ===== CUT LIST CALCULATOR CHALLENGES =====
  'cutlist-first-plan': {
    id: 'cutlist-first-plan',
    name: 'First Cut Plan',
    description: '[NEEDS REVIEW] Create your first cut list.',
    category: 'cutlist',
    xpReward: 25,
    requirementType: 'count',
    requirementValue: 1,
    repeatable: false,
  },

  'cutlist-optimizer': {
    id: 'cutlist-optimizer',
    name: 'Material Optimizer',
    description: '[NEEDS REVIEW] Create 10 cut lists.',
    category: 'cutlist',
    xpReward: 75,
    requirementType: 'count',
    requirementValue: 10,
    repeatable: false,
  },

  'cutlist-efficiency': {
    id: 'cutlist-efficiency',
    name: 'Efficiency Expert',
    description: '[NEEDS REVIEW] Create a cut list with less than 5% waste.',
    category: 'cutlist',
    xpReward: 100,
    requirementType: 'accuracy',
    requirementValue: 5, // less than 5% waste
    repeatable: true,
  },

  // ===== GENERAL PROGRESSION CHALLENGES =====
  'level-up-5': {
    id: 'level-up-5',
    name: 'Progressing Nicely',
    description: '[NEEDS REVIEW] Reach level 5.',
    category: 'general',
    xpReward: 50,
    requirementType: 'count',
    requirementValue: 5,
    repeatable: false,
  },

  'level-up-10': {
    id: 'level-up-10',
    name: 'Skilled Worker',
    description: '[NEEDS REVIEW] Reach level 10.',
    category: 'general',
    xpReward: 100,
    requirementType: 'count',
    requirementValue: 10,
    repeatable: false,
  },

  'streak-3': {
    id: 'streak-3',
    name: 'Building Habits',
    description: '[NEEDS REVIEW] Practice 3 days in a row.',
    category: 'general',
    xpReward: 50,
    requirementType: 'streak',
    requirementValue: 3,
    repeatable: false,
  },

  'streak-7': {
    id: 'streak-7',
    name: 'Committed Learner',
    description: '[NEEDS REVIEW] Practice 7 days in a row.',
    category: 'general',
    xpReward: 150,
    requirementType: 'streak',
    requirementValue: 7,
    repeatable: false,
  },

  // ===== FUTURE TOOL CHALLENGES (Placeholders) =====
  'tape-measure-beginner': {
    id: 'tape-measure-beginner',
    name: 'Tape Measure Basics',
    description: '[NEEDS REVIEW] Complete 10 tape measure challenges.',
    category: 'measurement',
    xpReward: 75,
    requirementType: 'count',
    requirementValue: 10,
    repeatable: false,
  },

  'tape-measure-accuracy': {
    id: 'tape-measure-accuracy',
    name: 'Precision Reader',
    description: '[NEEDS REVIEW] Achieve 90% accuracy on 20 measurements.',
    category: 'measurement',
    xpReward: 100,
    requirementType: 'accuracy',
    requirementValue: 90,
    repeatable: false,
  },

  'tape-measure-speed': {
    id: 'tape-measure-speed',
    name: 'Speed Reader',
    description: '[NEEDS REVIEW] Read 10 measurements in under 30 seconds.',
    category: 'measurement',
    xpReward: 125,
    requirementType: 'speed',
    requirementValue: 30,
    repeatable: true,
  },
};

/**
 * Get all challenges as an array
 */
export function getAllChallenges(): Challenge[] {
  return Object.values(CHALLENGES);
}

/**
 * Get challenges by category
 */
export function getChallengesByCategory(category: Challenge['category']): Challenge[] {
  return getAllChallenges().filter((c) => c.category === category);
}

/**
 * Check if a challenge is completed
 */
export function isChallengeCompleted(
  challengeId: string,
  completedChallenges: string[]
): boolean {
  return completedChallenges.includes(challengeId);
}

/**
 * Get challenge progress percentage
 */
export function getChallengeProgress(
  challengeId: string,
  currentProgress: number
): number {
  const challenge = CHALLENGES[challengeId];
  if (!challenge) return 0;

  return Math.min(100, (currentProgress / challenge.requirementValue) * 100);
}
