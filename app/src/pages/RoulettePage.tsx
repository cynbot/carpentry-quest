import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkshop } from '../contexts/WorkshopContext';
import { REELS, REROLLS_PER_SESSION, randomFrom, type RouletteReel } from '../data/roulette';
import { newId, type Project, type RouletteSeed } from '../types/workshop';

type SpinState = Record<RouletteReel['key'], { value: string; locked: boolean }>;

export function RoulettePage() {
  const { workshop, update, addJournalEntry } = useWorkshop();
  const navigate = useNavigate();

  // Ground the material reel in the actual scrap bin — randomness stays *ours*.
  const reels = useMemo<RouletteReel[]>(() => {
    const scrapEntries = workshop.scrap.map((s) => `from the scrap bin: ${s.material}`);
    return REELS.map((reel) =>
      reel.key === 'material' && scrapEntries.length > 0
        ? { ...reel, pool: [...reel.pool, ...scrapEntries] }
        : reel
    );
  }, [workshop.scrap]);

  const [spin, setSpin] = useState<SpinState | null>(null);
  const [rerollsLeft, setRerollsLeft] = useState(REROLLS_PER_SESSION);

  const handleSpinAll = () => {
    const next = {} as SpinState;
    for (const reel of reels) {
      next[reel.key] = { value: randomFrom(reel.pool), locked: false };
    }
    setSpin(next);
    setRerollsLeft(REROLLS_PER_SESSION);
  };

  const handleReroll = () => {
    if (!spin || rerollsLeft <= 0) return;
    const next = { ...spin };
    for (const reel of reels) {
      if (!next[reel.key].locked) {
        next[reel.key] = { value: randomFrom(reel.pool, next[reel.key].value), locked: false };
      }
    }
    setSpin(next);
    setRerollsLeft((n) => n - 1);
  };

  const toggleLock = (key: RouletteReel['key']) => {
    if (!spin) return;
    setSpin({ ...spin, [key]: { ...spin[key], locked: !spin[key].locked } });
  };

  const handleAdopt = () => {
    if (!spin) return;
    const seed: RouletteSeed = {
      material: spin.material.value,
      form: spin.form.value,
      technique: spin.technique.value,
      twist: spin.twist.value,
    };
    const project: Project = {
      id: newId(),
      name: `${seed.form} (roulette)`,
      description: `A spin dared us: ${seed.material}, ${seed.technique}, and the twist — ${seed.twist}.`,
      status: 'dreaming',
      parts: [],
      materials: [],
      shopping: [],
      journal: [],
      seed,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    update((w) => ({ ...w, projects: [project, ...w.projects] }));
    addJournalEntry(
      project.id,
      'claude',
      `Born from the roulette: ${seed.material} × ${seed.form} × ${seed.technique} × “${seed.twist}”. First move: sketch it small, then dry-fit before glue. [NEEDS REVIEW — concept only, no dimensions yet]`
    );
    navigate(`/projects/${project.id}`);
  };

  const allUnlocked = spin && Object.values(spin).every((slot) => !slot.locked);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-heartwood rounded-full" />
        <h2 className="text-3xl font-bold">Creativity Roulette</h2>
      </div>
      <p className="text-metallic mb-6">
        Spin all four reels, lock what sparks, reroll the rest ({REROLLS_PER_SESSION} rerolls a
        session — scarcity makes it decisive). Add scrap to the 🗄️ Inventory and it shows up in
        the Material reel. Constraint dials and the AI concept pass arrive in Phase 3.
      </p>

      {!spin ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🎰</div>
          <button onClick={handleSpinAll} className="btn-primary text-xl px-10">
            Spin
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reels.map((reel) => {
            const slot = spin[reel.key];
            return (
              <button
                key={reel.key}
                onClick={() => toggleLock(reel.key)}
                className={`w-full text-left card flex items-center gap-4 transition-all ${
                  slot.locked ? 'border-heartwood bg-gray-800' : 'hover:border-metallic/50'
                }`}
                title={slot.locked ? 'Locked — click to release' : 'Click to lock this reel'}
              >
                <span className="text-3xl">{reel.emoji}</span>
                <div className="flex-1">
                  <div className="text-xs text-metallic uppercase tracking-wide">{reel.label}</div>
                  <div className="text-xl font-semibold text-sand">{slot.value}</div>
                </div>
                <span className={`text-2xl ${slot.locked ? '' : 'opacity-25'}`}>
                  {slot.locked ? '🔒' : '🔓'}
                </span>
              </button>
            );
          })}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReroll}
              disabled={rerollsLeft <= 0}
              className={`btn-secondary flex-1 ${rerollsLeft <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {allUnlocked ? 'Reroll everything' : 'Reroll unlocked'} ({rerollsLeft} left)
            </button>
            <button onClick={handleAdopt} className="btn-primary flex-1">
              🌱 Adopt this spin
            </button>
          </div>
          <button onClick={handleSpinAll} className="w-full text-metallic hover:text-white text-sm py-2">
            Start a fresh session
          </button>
        </div>
      )}
    </div>
  );
}
