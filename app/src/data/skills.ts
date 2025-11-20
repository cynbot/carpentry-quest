/**
 * Skill Tree Data
 *
 * [NEEDS REVIEW] - All skill names, descriptions, and bonuses are placeholders
 * to be verified and refined based on actual carpentry curriculum.
 */

import type { Skill } from '../types/progression';

export const SKILLS: Record<string, Skill> = {
  // ===== TIER 0: CORE (Required Starting Point) =====
  'safety-core': {
    id: 'safety-core',
    name: 'Safety Fundamentals',
    category: 'safety',
    description: '[NEEDS REVIEW] Understanding basic job site safety, PPE, and hazard awareness.',
    prerequisites: [],
    cost: 0, // Free - always unlocked
    icon: '🦺',
    isCore: true,
    bonuses: [
      {
        type: 'unlock_feature',
        value: 1,
        description: 'Unlocks all safety checklists and tools',
      },
    ],
  },

  // ===== TIER 1: FOUNDATION SKILLS =====
  'measurement-basics': {
    id: 'measurement-basics',
    name: 'Measurement Basics',
    category: 'measurement',
    description: '[NEEDS REVIEW] Reading tape measures, understanding fractions and decimals.',
    prerequisites: ['safety-core'],
    cost: 1,
    icon: '📏',
    bonuses: [
      {
        type: 'xp_multiplier',
        value: 1.1,
        description: '+10% XP from measurement challenges',
      },
    ],
  },

  'materials-knowledge': {
    id: 'materials-knowledge',
    name: 'Materials Knowledge',
    category: 'materials',
    description: '[NEEDS REVIEW] Understanding lumber grades, plywood types, and common fasteners.',
    prerequisites: ['safety-core'],
    cost: 1,
    icon: '🪵',
    bonuses: [
      {
        type: 'unlock_feature',
        value: 1,
        description: 'Unlocks Materials 101 reference guide',
      },
    ],
  },

  'framing-fundamentals': {
    id: 'framing-fundamentals',
    name: 'Framing Fundamentals',
    category: 'framing',
    description: '[NEEDS REVIEW] Basic framing techniques, wall layout, and structural concepts.',
    prerequisites: ['safety-core'],
    cost: 1,
    icon: '🏗️',
    bonuses: [
      {
        type: 'xp_multiplier',
        value: 1.1,
        description: '+10% XP from framing challenges',
      },
    ],
  },

  // ===== TIER 2: SPECIALIZED SKILLS =====
  'carpentry-math': {
    id: 'carpentry-math',
    name: 'Carpentry Math',
    category: 'math',
    description: '[NEEDS REVIEW] Pythagorean theorem, board feet, rise/run calculations.',
    prerequisites: ['measurement-basics'],
    cost: 1,
    icon: '🧮',
    bonuses: [
      {
        type: 'xp_multiplier',
        value: 1.15,
        description: '+15% XP from math challenges',
      },
      {
        type: 'unlock_feature',
        value: 1,
        description: 'Unlocks math mini-games',
      },
    ],
  },

  'precision-measurement': {
    id: 'precision-measurement',
    name: 'Precision Measurement',
    category: 'measurement',
    description: '[NEEDS REVIEW] Advanced tape reading, measuring to 1/16", layout techniques.',
    prerequisites: ['measurement-basics'],
    cost: 1,
    icon: '🎯',
    bonuses: [
      {
        type: 'accuracy_bonus',
        value: 1.2,
        description: '+20% accuracy scoring in measurement games',
      },
    ],
  },

  'cutting-techniques': {
    id: 'cutting-techniques',
    name: 'Cutting Techniques',
    category: 'cutting',
    description: '[NEEDS REVIEW] Safe and accurate cutting with hand and power saws.',
    prerequisites: ['framing-fundamentals'],
    cost: 1,
    icon: '🪚',
    bonuses: [
      {
        type: 'unlock_feature',
        value: 1,
        description: 'Unlocks advanced cut list features',
      },
    ],
  },

  'blueprint-reading': {
    id: 'blueprint-reading',
    name: 'Blueprint Reading',
    category: 'blueprint',
    description: '[NEEDS REVIEW] Understanding construction drawings, symbols, and specifications.',
    prerequisites: ['framing-fundamentals', 'materials-knowledge'],
    cost: 2,
    icon: '📐',
    bonuses: [
      {
        type: 'unlock_feature',
        value: 1,
        description: 'Unlocks blueprint reading challenges',
      },
    ],
  },

  // ===== TIER 3: ADVANCED SKILLS =====
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    category: 'measurement',
    description: '[NEEDS REVIEW] Lightning-fast measurement and calculation under pressure.',
    prerequisites: ['precision-measurement', 'carpentry-math'],
    cost: 2,
    icon: '⚡',
    bonuses: [
      {
        type: 'time_bonus',
        value: 1.25,
        description: '+25% time bonus scoring in speed challenges',
      },
      {
        type: 'xp_multiplier',
        value: 1.2,
        description: '+20% XP from timed challenges',
      },
    ],
  },

  'master-framer': {
    id: 'master-framer',
    name: 'Master Framer',
    category: 'framing',
    description: '[NEEDS REVIEW] Advanced framing, roof framing, and complex layouts.',
    prerequisites: ['framing-fundamentals', 'cutting-techniques', 'blueprint-reading'],
    cost: 3,
    icon: '👷',
    bonuses: [
      {
        type: 'xp_multiplier',
        value: 1.3,
        description: '+30% XP from all framing activities',
      },
    ],
  },

  'materials-expert': {
    id: 'materials-expert',
    name: 'Materials Expert',
    category: 'materials',
    description: '[NEEDS REVIEW] Deep knowledge of material properties, selection, and optimization.',
    prerequisites: ['materials-knowledge', 'cutting-techniques'],
    cost: 2,
    icon: '📦',
    bonuses: [
      {
        type: 'unlock_feature',
        value: 1,
        description: 'Unlocks material optimization challenges',
      },
    ],
  },

  // ===== TIER 4: MASTERY =====
  'journeyman': {
    id: 'journeyman',
    name: 'Journeyman Carpenter',
    category: 'safety',
    description: '[NEEDS REVIEW] Master-level carpentry knowledge. You\'re ready for the test!',
    prerequisites: ['speed-demon', 'master-framer', 'materials-expert'],
    cost: 5,
    icon: '🏆',
    isCore: true,
    bonuses: [
      {
        type: 'xp_multiplier',
        value: 1.5,
        description: '+50% XP from all activities',
      },
      {
        type: 'unlock_feature',
        value: 1,
        description: 'Unlocks union test prep mode',
      },
    ],
  },
};

export const SKILL_TREE_LEVELS = {
  tier0: ['safety-core'],
  tier1: ['measurement-basics', 'materials-knowledge', 'framing-fundamentals'],
  tier2: ['carpentry-math', 'precision-measurement', 'cutting-techniques', 'blueprint-reading'],
  tier3: ['speed-demon', 'master-framer', 'materials-expert'],
  tier4: ['journeyman'],
};

/**
 * Get all skills as an array
 */
export function getAllSkills(): Skill[] {
  return Object.values(SKILLS);
}

/**
 * Check if a skill can be unlocked by the player
 */
export function canUnlockSkill(
  skillId: string,
  unlockedSkills: string[],
  availablePoints: number
): { canUnlock: boolean; reason?: string } {
  const skill = SKILLS[skillId];

  if (!skill) {
    return { canUnlock: false, reason: 'Skill not found' };
  }

  // Already unlocked
  if (unlockedSkills.includes(skillId)) {
    return { canUnlock: false, reason: 'Already unlocked' };
  }

  // Check skill points
  if (availablePoints < skill.cost) {
    return { canUnlock: false, reason: `Need ${skill.cost} skill points (have ${availablePoints})` };
  }

  // Check prerequisites
  const missingPrereqs = skill.prerequisites.filter(
    (prereqId) => !unlockedSkills.includes(prereqId)
  );

  if (missingPrereqs.length > 0) {
    const prereqNames = missingPrereqs.map((id) => SKILLS[id]?.name || id);
    return { canUnlock: false, reason: `Requires: ${prereqNames.join(', ')}` };
  }

  return { canUnlock: true };
}

/**
 * Get the total bonus multiplier for a given bonus type
 */
export function getTotalBonus(
  bonusType: 'xp_multiplier' | 'time_bonus' | 'accuracy_bonus',
  unlockedSkills: string[]
): number {
  let total = 1.0;

  for (const skillId of unlockedSkills) {
    const skill = SKILLS[skillId];
    if (skill?.bonuses) {
      for (const bonus of skill.bonuses) {
        if (bonus.type === bonusType) {
          total *= bonus.value;
        }
      }
    }
  }

  return total;
}
