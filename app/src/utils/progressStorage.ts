/**
 * Player Progress Storage Utilities
 *
 * Manages localStorage persistence for player progression data.
 */

import type { PlayerProgress } from '../types/progression';
import { levelFromXP, skillPointsFromLevel } from '../types/progression';

const STORAGE_KEY = 'carpentry-quest-progress';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  progress: PlayerProgress;
}

/**
 * Get default/initial player progress
 */
export function getDefaultProgress(): PlayerProgress {
  const now = Date.now();

  return {
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    skillPoints: 0,
    unlockedSkills: ['safety-core'], // Start with safety unlocked
    completedChallenges: [],
    challengeProgress: {},
    stats: {
      fractionsConverted: 0,
      fractionsCalculated: 0,
      cutListsCalculated: 0,
      totalSessionTime: 0,
      sessionsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      tapeMeasureAccuracy: 0,
      mathProblemsSolved: 0,
      mathProblemsCorrect: 0,
    },
    createdAt: now,
    lastPlayed: now,
  };
}

/**
 * Load player progress from localStorage
 */
export function loadProgress(): PlayerProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return getDefaultProgress();
    }

    const data: StorageData = JSON.parse(stored);

    // Version migration (if needed in future)
    if (data.version !== STORAGE_VERSION) {
      console.log('Migrating storage version...');
      // Add migration logic here if storage format changes
    }

    return data.progress;
  } catch (error) {
    console.error('Error loading progress:', error);
    return getDefaultProgress();
  }
}

/**
 * Save player progress to localStorage
 */
export function saveProgress(progress: PlayerProgress): void {
  try {
    const data: StorageData = {
      version: STORAGE_VERSION,
      progress: {
        ...progress,
        lastPlayed: Date.now(),
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Award XP to the player and handle level ups
 */
export function awardXP(
  progress: PlayerProgress,
  xpAmount: number,
  _source: string
): {
  newProgress: PlayerProgress;
  leveledUp: boolean;
  newLevel?: number;
  skillPointsEarned?: number;
} {
  const oldLevel = progress.level;
  const newTotalXP = progress.totalXP + xpAmount;

  const { level: newLevel, currentLevelXP } = levelFromXP(newTotalXP);
  const leveledUp = newLevel > oldLevel;

  let skillPointsEarned = 0;
  if (leveledUp) {
    const oldSkillPoints = skillPointsFromLevel(oldLevel);
    const newSkillPoints = skillPointsFromLevel(newLevel);
    skillPointsEarned = newSkillPoints - oldSkillPoints;
  }

  const newProgress: PlayerProgress = {
    ...progress,
    totalXP: newTotalXP,
    level: newLevel,
    currentLevelXP,
    skillPoints: progress.skillPoints + skillPointsEarned,
  };

  return {
    newProgress,
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
    skillPointsEarned: leveledUp ? skillPointsEarned : undefined,
  };
}

/**
 * Unlock a skill and spend skill points
 */
export function unlockSkill(
  progress: PlayerProgress,
  skillId: string,
  skillCost: number
): PlayerProgress {
  if (progress.unlockedSkills.includes(skillId)) {
    console.warn(`Skill ${skillId} already unlocked`);
    return progress;
  }

  if (progress.skillPoints < skillCost) {
    console.warn(`Not enough skill points to unlock ${skillId}`);
    return progress;
  }

  return {
    ...progress,
    unlockedSkills: [...progress.unlockedSkills, skillId],
    skillPoints: progress.skillPoints - skillCost,
  };
}

/**
 * Mark a challenge as completed
 */
export function completeChallenge(
  progress: PlayerProgress,
  challengeId: string
): PlayerProgress {
  if (progress.completedChallenges.includes(challengeId)) {
    return progress; // Already completed
  }

  return {
    ...progress,
    completedChallenges: [...progress.completedChallenges, challengeId],
  };
}

/**
 * Update challenge progress
 */
export function updateChallengeProgress(
  progress: PlayerProgress,
  challengeId: string,
  value: number
): PlayerProgress {
  return {
    ...progress,
    challengeProgress: {
      ...progress.challengeProgress,
      [challengeId]: value,
    },
  };
}

/**
 * Increment a stat counter
 */
export function incrementStat(
  progress: PlayerProgress,
  stat: keyof PlayerProgress['stats'],
  amount: number = 1
): PlayerProgress {
  return {
    ...progress,
    stats: {
      ...progress.stats,
      [stat]: (progress.stats[stat] as number) + amount,
    },
  };
}

/**
 * Update daily streak
 */
export function updateStreak(progress: PlayerProgress): PlayerProgress {
  const now = Date.now();
  const lastPlayed = progress.lastPlayed;
  const oneDayMs = 24 * 60 * 60 * 1000;
  const daysSinceLastPlayed = Math.floor((now - lastPlayed) / oneDayMs);

  let newStreak = progress.stats.currentStreak;

  if (daysSinceLastPlayed === 0) {
    // Same day, keep streak
    newStreak = progress.stats.currentStreak;
  } else if (daysSinceLastPlayed === 1) {
    // Consecutive day, increment
    newStreak = progress.stats.currentStreak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  const longestStreak = Math.max(progress.stats.longestStreak, newStreak);

  return {
    ...progress,
    stats: {
      ...progress.stats,
      currentStreak: newStreak,
      longestStreak,
    },
  };
}

/**
 * Reset all progress (useful for testing)
 */
export function resetProgress(): PlayerProgress {
  const fresh = getDefaultProgress();
  saveProgress(fresh);
  return fresh;
}

/**
 * Export progress as JSON (for backup)
 */
export function exportProgress(progress: PlayerProgress): string {
  return JSON.stringify(progress, null, 2);
}

/**
 * Import progress from JSON (for restore)
 */
export function importProgress(json: string): PlayerProgress | null {
  try {
    const progress = JSON.parse(json) as PlayerProgress;
    saveProgress(progress);
    return progress;
  } catch (error) {
    console.error('Error importing progress:', error);
    return null;
  }
}
