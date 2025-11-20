import { useState } from 'react';
import { FractionConverter } from './components/FractionConverter';
import { CutListCalculator } from './components/CutListCalculator';

type Tool = 'fraction' | 'cutlist';

function App() {
  const [activeTool, setActiveTool] = useState<Tool>('fraction');

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
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex gap-2">
            <button
              onClick={() => setActiveTool('fraction')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTool === 'fraction'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-800 text-metallic hover:bg-gray-700'
              }`}
            >
              Fraction Converter
            </button>
            <button
              onClick={() => setActiveTool('cutlist')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTool === 'cutlist'
                  ? 'bg-primary-red text-white'
                  : 'bg-gray-800 text-metallic hover:bg-gray-700'
              }`}
            >
              Cut-List Calculator
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
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

export default App;
