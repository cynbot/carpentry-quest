/**
 * Progress Context
 *
 * Provides global access to player progression state and actions.
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { PlayerProgress, XPGain } from '../types/progression';
import { xpForLevel } from '../types/progression';
import {
  loadProgress,
  saveProgress,
  awardXP as awardXPUtil,
  unlockSkill as unlockSkillUtil,
  completeChallenge as completeChallengeUtil,
  updateChallengeProgress as updateChallengeProgressUtil,
  incrementStat as incrementStatUtil,
  updateStreak,
} from '../utils/progressStorage';
import { CHALLENGES } from '../data/challenges';
import { getTotalBonus } from '../data/skills';

interface ProgressContextValue {
  progress: PlayerProgress;

  // XP and leveling
  awardXP: (amount: number, source: string) => XPGain | null;
  getXPForNextLevel: () => number;
  getXPProgress: () => number; // percentage

  // Skills
  unlockSkill: (skillId: string, skillCost: number) => boolean;
  hasSkill: (skillId: string) => boolean;

  // Challenges
  completeChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, value: number, checkCompletion?: boolean) => void;
  getChallengeProgress: (challengeId: string) => number;
  isChallengeCompleted: (challengeId: string) => boolean;

  // Stats
  incrementStat: (stat: keyof PlayerProgress['stats'], amount?: number) => void;

  // Bonuses
  getXPMultiplier: () => number;

  // Utilities
  refreshProgress: () => void;

  // Recent XP gains (for animation)
  recentXPGains: XPGain[];
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const loaded = loadProgress();
    // Update streak on load
    return updateStreak(loaded);
  });

  const [recentXPGains, setRecentXPGains] = useState<XPGain[]>([]);

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Clean up old XP gains from animation queue
  useEffect(() => {
    if (recentXPGains.length > 0) {
      const timer = setTimeout(() => {
        setRecentXPGains([]);
      }, 3000); // Clear after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [recentXPGains]);

  const getXPMultiplier = useCallback(() => {
    return getTotalBonus('xp_multiplier', progress.unlockedSkills);
  }, [progress.unlockedSkills]);

  const awardXP = useCallback((amount: number, source: string): XPGain | null => {
    const multiplier = getXPMultiplier();
    const finalAmount = Math.floor(amount * multiplier);

    const result = awardXPUtil(progress, finalAmount, source);

    setProgress(result.newProgress);

    const xpGain: XPGain = {
      amount: finalAmount,
      source,
      timestamp: Date.now(),
      levelUp: result.leveledUp,
      newLevel: result.newLevel,
    };

    setRecentXPGains(prev => [...prev, xpGain]);

    return xpGain;
  }, [progress, getXPMultiplier]);

  const getXPForNextLevel = useCallback(() => {
    return xpForLevel(progress.level);
  }, [progress.level]);

  const getXPProgress = useCallback(() => {
    const needed = getXPForNextLevel();
    return (progress.currentLevelXP / needed) * 100;
  }, [progress.currentLevelXP, getXPForNextLevel]);

  const unlockSkill = useCallback((skillId: string, skillCost: number): boolean => {
    if (progress.unlockedSkills.includes(skillId)) {
      return false;
    }

    if (progress.skillPoints < skillCost) {
      return false;
    }

    const newProgress = unlockSkillUtil(progress, skillId, skillCost);
    setProgress(newProgress);
    return true;
  }, [progress]);

  const hasSkill = useCallback((skillId: string): boolean => {
    return progress.unlockedSkills.includes(skillId);
  }, [progress.unlockedSkills]);

  const completeChallenge = useCallback((challengeId: string) => {
    const challenge = CHALLENGES[challengeId];
    if (!challenge) return;

    if (progress.completedChallenges.includes(challengeId)) {
      return; // Already completed
    }

    const newProgress = completeChallengeUtil(progress, challengeId);
    setProgress(newProgress);

    // Award XP for completing the challenge
    awardXP(challenge.xpReward, `Challenge: ${challenge.name}`);
  }, [progress, awardXP]);

  const updateChallengeProgress = useCallback((
    challengeId: string,
    value: number,
    checkCompletion: boolean = true
  ) => {
    const challenge = CHALLENGES[challengeId];
    if (!challenge) return;

    // Don't update if already completed and not repeatable
    if (!challenge.repeatable && progress.completedChallenges.includes(challengeId)) {
      return;
    }

    const newProgress = updateChallengeProgressUtil(progress, challengeId, value);
    setProgress(newProgress);

    // Auto-complete if threshold reached
    if (checkCompletion && value >= challenge.requirementValue) {
      completeChallenge(challengeId);
    }
  }, [progress, completeChallenge]);

  const getChallengeProgress = useCallback((challengeId: string): number => {
    return progress.challengeProgress[challengeId] || 0;
  }, [progress.challengeProgress]);

  const isChallengeCompleted = useCallback((challengeId: string): boolean => {
    return progress.completedChallenges.includes(challengeId);
  }, [progress.completedChallenges]);

  const incrementStat = useCallback((
    stat: keyof PlayerProgress['stats'],
    amount: number = 1
  ) => {
    const newProgress = incrementStatUtil(progress, stat, amount);
    setProgress(newProgress);
  }, [progress]);

  const refreshProgress = useCallback(() => {
    const loaded = loadProgress();
    setProgress(updateStreak(loaded));
  }, []);

  const value: ProgressContextValue = {
    progress,
    awardXP,
    getXPForNextLevel,
    getXPProgress,
    unlockSkill,
    hasSkill,
    completeChallenge,
    updateChallengeProgress,
    getChallengeProgress,
    isChallengeCompleted,
    incrementStat,
    getXPMultiplier,
    refreshProgress,
    recentXPGains,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
