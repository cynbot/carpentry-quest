/**
 * Skill Tree Component
 *
 * Interactive skill tree where players can unlock skills with skill points.
 */

import { useState } from 'react';
import { useProgress } from '../contexts/ProgressContext';
import { SKILLS, SKILL_TREE_LEVELS, canUnlockSkill } from '../data/skills';
import type { Skill } from '../types/progression';

interface SkillNodeProps {
  skill: Skill;
  isUnlocked: boolean;
  canUnlock: boolean;
  unlockReason?: string;
  onUnlock: () => void;
}

function SkillNode({ skill, isUnlocked, canUnlock, unlockReason, onUnlock }: SkillNodeProps) {
  const [showDetails, setShowDetails] = useState(false);

  const bgColor = isUnlocked
    ? 'bg-primary-red border-primary-red'
    : canUnlock
    ? 'bg-gray-800 border-sand hover:border-primary-red'
    : 'bg-gray-900 border-metallic/30';

  const textColor = isUnlocked ? 'text-white' : canUnlock ? 'text-sand' : 'text-metallic/50';

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`${bgColor} ${textColor} border-2 rounded-lg p-4 w-full transition-all hover:scale-105 ${
          canUnlock && !isUnlocked ? 'cursor-pointer' : ''
        }`}
      >
        {/* Icon and Name */}
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">{skill.icon}</div>
          <div className="flex-1 text-left">
            <div className="font-bold text-sm">{skill.name}</div>
            {skill.cost > 0 && (
              <div className="text-xs opacity-75">
                {isUnlocked ? 'Unlocked' : `${skill.cost} points`}
              </div>
            )}
          </div>
        </div>

        {/* Status indicator */}
        {isUnlocked && (
          <div className="absolute top-2 right-2 text-success">✓</div>
        )}
        {!isUnlocked && skill.isCore && (
          <div className="absolute top-2 right-2 text-warning text-xs">CORE</div>
        )}
      </button>

      {/* Details popup */}
      {showDetails && (
        <div className="absolute z-10 mt-2 w-80 bg-gray-900 border-2 border-primary-red rounded-lg p-4 shadow-xl">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-4xl">{skill.icon}</div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-white mb-1">{skill.name}</h4>
              <div className="text-xs text-metallic uppercase">{skill.category}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(false);
              }}
              className="text-metallic hover:text-white"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-metallic mb-4">{skill.description}</p>

          {/* Prerequisites */}
          {skill.prerequisites.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-metallic mb-1">Prerequisites:</div>
              <div className="space-y-1">
                {skill.prerequisites.map((prereqId) => {
                  const prereq = SKILLS[prereqId];
                  return (
                    <div key={prereqId} className="text-xs text-sand flex items-center gap-1">
                      <span>{prereq?.icon}</span>
                      <span>{prereq?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bonuses */}
          {skill.bonuses && skill.bonuses.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-metallic mb-1">Bonuses:</div>
              <div className="space-y-1">
                {skill.bonuses.map((bonus, index) => (
                  <div key={index} className="text-xs text-success">
                    • {bonus.description}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unlock button */}
          {!isUnlocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (canUnlock) {
                  onUnlock();
                  setShowDetails(false);
                }
              }}
              disabled={!canUnlock}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                canUnlock
                  ? 'bg-primary-red text-white hover:bg-red-600'
                  : 'bg-gray-700 text-metallic cursor-not-allowed'
              }`}
            >
              {canUnlock ? `Unlock (${skill.cost} points)` : unlockReason || 'Locked'}
            </button>
          )}

          {isUnlocked && (
            <div className="text-center text-success font-semibold">
              ✓ Unlocked
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SkillTree() {
  const { progress, unlockSkill } = useProgress();

  const handleUnlockSkill = (skillId: string) => {
    const skill = SKILLS[skillId];
    if (!skill) return;

    const { canUnlock, reason } = canUnlockSkill(
      skillId,
      progress.unlockedSkills,
      progress.skillPoints
    );

    if (!canUnlock) {
      alert(reason || 'Cannot unlock this skill');
      return;
    }

    const success = unlockSkill(skillId, skill.cost);
    if (success) {
      // Success feedback handled by context
    }
  };

  const renderTier = (tierKey: keyof typeof SKILL_TREE_LEVELS, tierName: string) => {
    const skillIds = SKILL_TREE_LEVELS[tierKey];

    return (
      <div key={tierKey} className="mb-8">
        <h3 className="text-lg font-bold text-metallic mb-4 text-center">{tierName}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {skillIds.map((skillId) => {
            const skill = SKILLS[skillId];
            if (!skill) return null;

            const isUnlocked = progress.unlockedSkills.includes(skillId);
            const { canUnlock: canUnlockNow, reason } = canUnlockSkill(
              skillId,
              progress.unlockedSkills,
              progress.skillPoints
            );

            return (
              <SkillNode
                key={skillId}
                skill={skill}
                isUnlocked={isUnlocked}
                canUnlock={canUnlockNow}
                unlockReason={reason}
                onUnlock={() => handleUnlockSkill(skillId)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary-red rounded-full" />
            <h2 className="text-3xl font-bold">Skill Tree</h2>
          </div>
          <div className="bg-gray-900 px-4 py-2 rounded-lg border-2 border-sand">
            <div className="text-xs text-metallic">Skill Points</div>
            <div className="text-2xl font-bold text-sand text-center">
              {progress.skillPoints}
            </div>
          </div>
        </div>

        <p className="text-metallic mb-8">
          Unlock skills to gain bonuses and unlock new features. Spend your skill points wisely!
        </p>

        {/* Skill Tree Tiers */}
        <div className="relative">
          {/* Visual connections could be added here with SVG lines */}
          {renderTier('tier0', 'Foundation')}
          {renderTier('tier1', 'Core Skills')}
          {renderTier('tier2', 'Specialized Skills')}
          {renderTier('tier3', 'Advanced Skills')}
          {renderTier('tier4', 'Mastery')}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-metallic/20">
          <h4 className="text-sm font-semibold text-metallic mb-3">Legend:</h4>
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-red border-2 border-primary-red rounded" />
              <span className="text-metallic">Unlocked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 border-2 border-sand rounded" />
              <span className="text-metallic">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-900 border-2 border-metallic/30 rounded" />
              <span className="text-metallic">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
