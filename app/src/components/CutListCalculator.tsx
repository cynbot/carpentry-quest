import { useState } from 'react';
import {
  parseLength,
  formatLength,
  calculateCutPlan,
  COMMON_BOARD_LENGTHS,
  COMMON_SAW_KERFS,
  type Cut,
  type CutPlan,
} from '../utils/cutListCalculator';
import { useProgress } from '../contexts/ProgressContext';

export function CutListCalculator() {
  const [boardLength, setBoardLength] = useState(144); // 12 feet default
  const [sawKerf, setSawKerf] = useState(0.125); // 1/8" default
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [cutLength, setCutLength] = useState('');
  const [cutQuantity, setCutQuantity] = useState('1');
  const [cutLabel, setCutLabel] = useState('');
  const [cutPlan, setCutPlan] = useState<CutPlan | null>(null);

  const {
    awardXP,
    incrementStat,
    updateChallengeProgress,
    getChallengeProgress,
  } = useProgress();

  const handleAddCut = () => {
    const length = parseLength(cutLength);
    const quantity = parseInt(cutQuantity);

    if (!length || length <= 0) {
      alert('Please enter a valid length');
      return;
    }

    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (length > boardLength) {
      alert('Cut length cannot be longer than board length');
      return;
    }

    const newCut: Cut = {
      id: Date.now().toString(),
      length,
      quantity,
      label: cutLabel || `Cut ${cuts.length + 1}`,
    };

    setCuts([...cuts, newCut]);
    setCutLength('');
    setCutQuantity('1');
    setCutLabel('');
  };

  const handleRemoveCut = (id: string) => {
    setCuts(cuts.filter((c) => c.id !== id));
  };

  const handleCalculate = () => {
    if (cuts.length === 0) {
      alert('Please add some cuts first');
      return;
    }

    const plan = calculateCutPlan(cuts, boardLength, sawKerf);
    setCutPlan(plan);

    // Award XP and track stats
    awardXP(15, 'Cut list calculation');
    incrementStat('cutListsCalculated');

    // Update challenge progress
    const firstPlanCount = getChallengeProgress('cutlist-first-plan') || 0;
    updateChallengeProgress('cutlist-first-plan', firstPlanCount + 1);

    const optimizerCount = getChallengeProgress('cutlist-optimizer') || 0;
    updateChallengeProgress('cutlist-optimizer', optimizerCount + 1);

    // Check for efficiency challenge (less than 5% waste)
    if (plan.wastePercentage < 5) {
      awardXP(25, 'Efficiency bonus!');
      const efficiencyCount = getChallengeProgress('cutlist-efficiency') || 0;
      updateChallengeProgress('cutlist-efficiency', efficiencyCount + 1);
    }
  };

  const handleClearAll = () => {
    setCuts([]);
    setCutPlan(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-primary-red rounded-full" />
          <h2 className="text-3xl font-bold">Cut-List Calculator</h2>
        </div>

        <p className="text-metallic mb-6">
          Calculate how many boards you need for your cuts. Accounts for saw blade width (kerf).
        </p>

        {/* Board Settings */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold mb-2 text-metallic">
              Board Length
            </label>
            <select
              value={boardLength}
              onChange={(e) => setBoardLength(parseInt(e.target.value))}
              className="input w-full"
            >
              {COMMON_BOARD_LENGTHS.map((board) => (
                <option key={board.inches} value={board.inches}>
                  {board.feet}' ({board.inches}")
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-metallic">
              Saw Kerf (Blade Width)
            </label>
            <select
              value={sawKerf}
              onChange={(e) => setSawKerf(parseFloat(e.target.value))}
              className="input w-full"
            >
              {COMMON_SAW_KERFS.map((kerf) => (
                <option key={kerf.inches} value={kerf.inches}>
                  {kerf.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Cut Form */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-primary-red">Add Cut</h3>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                value={cutLength}
                onChange={(e) => setCutLength(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCut()}
                placeholder="Length (e.g., 8-2 or 98)"
                className="input w-full font-mono"
              />
            </div>
            <div>
              <input
                type="number"
                value={cutQuantity}
                onChange={(e) => setCutQuantity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCut()}
                placeholder="Quantity"
                min="1"
                className="input w-full"
              />
            </div>
            <div>
              <button onClick={handleAddCut} className="btn-primary w-full">
                Add
              </button>
            </div>
          </div>
          <div className="mt-2">
            <input
              type="text"
              value={cutLabel}
              onChange={(e) => setCutLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCut()}
              placeholder="Label (optional, e.g., 'Studs')"
              className="input w-full"
            />
          </div>
        </div>

        {/* Cuts List */}
        {cuts.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-primary-red">Your Cuts</h3>
              <button onClick={handleClearAll} className="text-sm text-metallic hover:text-white">
                Clear All
              </button>
            </div>
            <div className="space-y-2">
              {cuts.map((cut) => (
                <div
                  key={cut.id}
                  className="flex justify-between items-center bg-gray-900 rounded-lg p-3"
                >
                  <div>
                    <span className="font-semibold text-sand">{cut.label}</span>
                    <span className="text-metallic mx-2">—</span>
                    <span className="font-mono text-white">{formatLength(cut.length)}</span>
                    <span className="text-metallic ml-2">× {cut.quantity}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveCut(cut.id)}
                    className="text-warning hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleCalculate} className="btn-primary w-full mt-4">
              Calculate
            </button>
          </div>
        )}

        {/* Results */}
        {cutPlan && (
          <div className="mt-8 pt-6 border-t border-metallic/20">
            <h3 className="text-2xl font-bold mb-4 text-primary-red">Cut Plan</h3>

            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary-red">
                  {cutPlan.totalBoardsNeeded}
                </div>
                <div className="text-sm text-metallic">Boards Needed</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-warning">
                  {formatLength(cutPlan.totalWaste)}
                </div>
                <div className="text-sm text-metallic">Total Waste</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-sand">
                  {cutPlan.wastePercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-metallic">Waste Percentage</div>
              </div>
            </div>

            {/* Visual Board Diagrams */}
            <div className="space-y-6">
              {cutPlan.boards.map((board) => (
                <div key={board.boardNumber} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-sand">Board #{board.boardNumber}</h4>
                    <span className="text-sm text-metallic">
                      Waste: {formatLength(board.wasteLength)}
                    </span>
                  </div>

                  {/* Visual board representation */}
                  <div className="relative h-16 bg-gray-800 rounded border-2 border-metallic/30 overflow-hidden">
                    {board.cuts.map((cutInfo, index) => {
                      const widthPercent = (cutInfo.cut.length / boardLength) * 100;
                      const leftPercent = (cutInfo.position / boardLength) * 100;

                      return (
                        <div
                          key={index}
                          className="absolute top-0 bottom-0 bg-primary-red/70 border-r-2 border-white/20 flex items-center justify-center text-xs font-bold"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          title={`${cutInfo.cut.label}: ${formatLength(cutInfo.cut.length)}`}
                        >
                          <span className="truncate px-1">{cutInfo.cut.label}</span>
                        </div>
                      );
                    })}
                    {/* Show waste area */}
                    {board.wasteLength > 0 && (
                      <div
                        className="absolute top-0 bottom-0 bg-warning/20 flex items-center justify-center text-xs text-metallic"
                        style={{
                          right: 0,
                          width: `${(board.wasteLength / boardLength) * 100}%`,
                        }}
                      >
                        Waste
                      </div>
                    )}
                  </div>

                  {/* Cut details */}
                  <div className="mt-2 text-sm text-metallic">
                    {board.cuts.map((cutInfo, index) => (
                      <span key={index}>
                        {cutInfo.cut.label} ({formatLength(cutInfo.cut.length)})
                        {index < board.cuts.length - 1 && ' + '}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
