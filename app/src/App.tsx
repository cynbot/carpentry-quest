import { useState } from 'react';
import { FractionConverter } from './components/FractionConverter';
import { CutListCalculator } from './components/CutListCalculator';
import { CharacterDashboard } from './components/CharacterDashboard';
import { SkillTree } from './components/SkillTree';
import { XPNotification } from './components/XPNotification';
import { TapeMeasure } from './components/TapeMeasure';
import { ProgressProvider, useProgress } from './contexts/ProgressContext';

type Tool = 'character' | 'skills' | 'fraction' | 'cutlist' | 'tapemeasure';

function AppContent() {
  const [activeTool, setActiveTool] = useState<Tool>('character');
  const { progress } = useProgress();

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Header */}
      <header className="bg-gray-900 border-b-2 border-primary-red shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-red rounded-lg flex items-center justify-center">
                <span className="text-3xl">🔨</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Carpentry Quest</h1>
                <p className="text-metallic text-sm">Level Up Your Skills</p>
              </div>
            </div>

            {/* Level Badge */}
            <div className="bg-gray-800 px-4 py-2 rounded-lg border-2 border-primary-red">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🔨</div>
                <div>
                  <div className="text-xs text-metallic">Level</div>
                  <div className="text-xl font-bold text-primary-red">{progress.level}</div>
                </div>
                <div className="border-l border-metallic/30 pl-3">
                  <div className="text-xs text-metallic">SP</div>
                  <div className="text-xl font-bold text-sand">{progress.skillPoints}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTool('character')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTool === 'character'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-800 text-metallic hover:bg-gray-700'
              }`}
            >
              📊 Character
            </button>
            <button
              onClick={() => setActiveTool('skills')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTool === 'skills'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-800 text-metallic hover:bg-gray-700'
              }`}
            >
              🌳 Skill Tree
              {progress.skillPoints > 0 && (
                <span className="ml-2 bg-warning text-charcoal px-2 py-0.5 rounded-full text-xs font-bold">
                  {progress.skillPoints}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTool('tapemeasure')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTool === 'tapemeasure'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-800 text-metallic hover:bg-gray-700'
              }`}
            >
              📏 Tape Measure
            </button>
            <button
              onClick={() => setActiveTool('fraction')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTool === 'fraction'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-800 text-metallic hover:bg-gray-700'
              }`}
            >
              🔢 Fraction Converter
            </button>
            <button
              onClick={() => setActiveTool('cutlist')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTool === 'cutlist'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-800 text-metallic hover:bg-gray-700'
              }`}
            >
              🪚 Cut-List Calculator
            </button>
          </nav>
        </div>
      </header>

      {/* XP Notifications */}
      <XPNotification />

      {/* Main Content */}
      <main className="py-8">
        {activeTool === 'character' && <CharacterDashboard />}
        {activeTool === 'skills' && <SkillTree />}
        {activeTool === 'tapemeasure' && <TapeMeasure />}
        {activeTool === 'fraction' && <FractionConverter />}
        {activeTool === 'cutlist' && <CutListCalculator />}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-metallic/20">
        <div className="max-w-7xl mx-auto px-4 text-center text-metallic text-sm">
          Built with ❤️ for the journey to journeyman
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}

export default App;
