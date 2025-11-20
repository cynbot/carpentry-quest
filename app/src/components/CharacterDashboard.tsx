/**
 * Character Dashboard
 *
 * Displays player level, XP progress, skill points, and stats.
 */

import { useProgress } from '../contexts/ProgressContext';

export function CharacterDashboard() {
  const { progress, getXPForNextLevel, getXPProgress, getXPMultiplier } = useProgress();

  const xpProgress = getXPProgress();
  const xpNeeded = getXPForNextLevel();
  const xpMultiplier = getXPMultiplier();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-primary-red rounded-full" />
          <h2 className="text-3xl font-bold">Character Profile</h2>
        </div>

        {/* Level and XP */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Level */}
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-primary-red">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-metallic mb-1">Level</div>
                <div className="text-5xl font-bold text-primary-red">
                  {progress.level}
                </div>
              </div>
              <div className="text-6xl">🔨</div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-metallic mb-1">
                <span>XP Progress</span>
                <span>
                  {progress.currentLevelXP} / {xpNeeded}
                </span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-red to-warning transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-metallic text-center mt-3">
              {Math.floor(xpProgress)}% to Level {progress.level + 1}
            </div>
          </div>

          {/* Skill Points */}
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-sand">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-metallic mb-1">Skill Points</div>
                <div className="text-5xl font-bold text-sand">
                  {progress.skillPoints}
                </div>
              </div>
              <div className="text-6xl">⭐</div>
            </div>

            <div className="text-sm text-metallic mt-2">
              {progress.skillPoints > 0 ? (
                <span className="text-warning font-semibold">
                  Unspent points available!
                </span>
              ) : (
                'Earn more by leveling up'
              )}
            </div>

            <div className="text-xs text-metallic mt-4">
              Skills Unlocked: {progress.unlockedSkills.length}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-primary-red">Statistics</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Tool Usage */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-xs text-metallic mb-2">Fractions Converted</div>
              <div className="text-2xl font-bold text-sand">
                {progress.stats.fractionsConverted}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-xs text-metallic mb-2">Calculations Done</div>
              <div className="text-2xl font-bold text-sand">
                {progress.stats.fractionsCalculated}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-xs text-metallic mb-2">Cut Lists Made</div>
              <div className="text-2xl font-bold text-sand">
                {progress.stats.cutListsCalculated}
              </div>
            </div>

            {/* Progression */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-xs text-metallic mb-2">Total XP Earned</div>
              <div className="text-2xl font-bold text-primary-red">
                {progress.totalXP.toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-xs text-metallic mb-2">Current Streak</div>
              <div className="text-2xl font-bold text-warning">
                {progress.stats.currentStreak} {progress.stats.currentStreak === 1 ? 'day' : 'days'}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-xs text-metallic mb-2">Longest Streak</div>
              <div className="text-2xl font-bold text-success">
                {progress.stats.longestStreak} {progress.stats.longestStreak === 1 ? 'day' : 'days'}
              </div>
            </div>

            {/* Challenges */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-xs text-metallic mb-2">Challenges Done</div>
              <div className="text-2xl font-bold text-sand">
                {progress.completedChallenges.length}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-xs text-metallic mb-2">XP Multiplier</div>
              <div className="text-2xl font-bold text-success">
                {xpMultiplier.toFixed(2)}x
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-xs text-metallic mb-2">Sessions Played</div>
              <div className="text-2xl font-bold text-sand">
                {progress.stats.sessionsCompleted}
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="pt-6 border-t border-metallic/20">
          <div className="text-xs text-metallic space-y-1">
            <div>
              Account created: {new Date(progress.createdAt).toLocaleDateString()}
            </div>
            <div>
              Last played: {new Date(progress.lastPlayed).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
