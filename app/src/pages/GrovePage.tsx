import { useState } from 'react';
import { useWorkshop } from '../contexts/WorkshopContext';
import { newId, type Dream } from '../types/workshop';

/** Growth rings: one ring per finished project feeding this dream. */
function GrowthRings({ rings }: { rings: number }) {
  const shown = Math.min(rings, 8);
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 shrink-0">
      <circle cx="50" cy="50" r="6" fill="#E09F3E" />
      {Array.from({ length: shown }, (_, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={12 + i * 5}
          fill="none"
          stroke="#E09F3E"
          strokeOpacity={0.85 - i * 0.08}
          strokeWidth="2.5"
        />
      ))}
      {rings > shown && (
        <text x="50" y="96" textAnchor="middle" fill="#B8B8B8" fontSize="10">
          +{rings - shown}
        </text>
      )}
    </svg>
  );
}

export function GrovePage() {
  const { workshop, update } = useWorkshop();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [description, setDescription] = useState('');

  const handlePlant = () => {
    if (!name.trim()) return;
    const dream: Dream = {
      id: newId(),
      name: name.trim(),
      description: description.trim() || undefined,
      emoji: emoji.trim() || '🌳',
      createdAt: Date.now(),
    };
    update((w) => ({ ...w, dreams: [...w.dreams, dream] }));
    setName('');
    setEmoji('');
    setDescription('');
  };

  const handleUproot = (dream: Dream) => {
    if (!window.confirm(`Uproot “${dream.name}”? Projects that fed it keep their history.`)) return;
    update((w) => ({
      ...w,
      dreams: w.dreams.filter((d) => d.id !== dream.id),
      projects: w.projects.map((p) =>
        p.dreamId === dream.id ? { ...p, dreamId: undefined } : p
      ),
    }));
  };

  const ringsFor = (dreamId: string) =>
    workshop.projects.filter((p) => p.dreamId === dreamId && p.status === 'finished').length;

  const feedersFor = (dreamId: string) =>
    workshop.projects.filter((p) => p.dreamId === dreamId).length;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-moss rounded-full" />
        <h2 className="text-3xl font-bold">The Grove</h2>
      </div>
      <p className="text-metallic mb-6">
        Long dreams live here as trees. Link a project to a dream, and every project you
        finish adds a growth ring. Dreams like these are built the way trees grow —
        one ring at a time.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 mb-8">
        <div className="flex gap-2 mb-2">
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="🌳"
            className="input w-16 text-center"
            maxLength={4}
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePlant()}
            placeholder="Plant a dream… (e.g., 100 acres and a tree farm)"
            className="input flex-1"
          />
          <button onClick={handlePlant} className="btn-primary">
            Plant
          </button>
        </div>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePlant()}
          placeholder="What does it look like when it's real? (optional)"
          className="input w-full"
        />
      </div>

      {workshop.dreams.length === 0 ? (
        <div className="card text-center text-metallic py-12">
          <div className="text-4xl mb-3">🌱</div>
          <p>The grove is waiting. A toy store with a little cafe? A tree farm? Plant it.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workshop.dreams.map((dream) => {
            const rings = ringsFor(dream.id);
            const feeders = feedersFor(dream.id);
            return (
              <div key={dream.id} className="card flex items-center gap-5">
                <GrowthRings rings={rings} />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-sand">
                    {dream.emoji} {dream.name}
                  </h3>
                  {dream.description && (
                    <p className="text-metallic text-sm mt-1">{dream.description}</p>
                  )}
                  <p className="text-moss text-sm mt-2">
                    {rings} growth ring{rings === 1 ? '' : 's'} · {feeders} project
                    {feeders === 1 ? '' : 's'} feeding it
                  </p>
                </div>
                <button
                  onClick={() => handleUproot(dream)}
                  className="text-warning hover:text-red-500 text-sm"
                >
                  Uproot
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
