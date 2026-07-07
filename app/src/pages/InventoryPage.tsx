import { useState } from 'react';
import { useWorkshop } from '../contexts/WorkshopContext';
import { newId } from '../types/workshop';

export function InventoryPage() {
  const { workshop, update } = useWorkshop();
  const [toolName, setToolName] = useState('');
  const [toolCategory, setToolCategory] = useState('');
  const [scrapMaterial, setScrapMaterial] = useState('');
  const [scrapDims, setScrapDims] = useState('');
  const [scrapQty, setScrapQty] = useState('1');

  const handleAddTool = () => {
    if (!toolName.trim()) return;
    update((w) => ({
      ...w,
      tools: [
        ...w.tools,
        { id: newId(), name: toolName.trim(), category: toolCategory.trim() || undefined },
      ],
    }));
    setToolName('');
    setToolCategory('');
  };

  const handleAddScrap = () => {
    if (!scrapMaterial.trim()) return;
    update((w) => ({
      ...w,
      scrap: [
        ...w.scrap,
        {
          id: newId(),
          material: scrapMaterial.trim(),
          dims: scrapDims.trim() || undefined,
          quantity: Math.max(1, parseInt(scrapQty) || 1),
        },
      ],
    }));
    setScrapMaterial('');
    setScrapDims('');
    setScrapQty('1');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-heartwood rounded-full" />
        <h2 className="text-3xl font-bold">Inventory</h2>
      </div>
      <p className="text-metallic mb-6">
        What we can build <em>with</em>, and what we can build <em>from</em>. The scrap bin
        feeds the 🎰 Roulette's material reel, and in Phase 3 it grounds the AI concept pass.
      </p>

      {/* Scrap bin */}
      <div className="card mb-6">
        <h3 className="text-xl font-bold text-heartwood mb-4">🪵 Scrap bin</h3>
        {workshop.scrap.length > 0 && (
          <div className="space-y-2 mb-4">
            {workshop.scrap.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-900 rounded-lg p-3">
                <div>
                  <span className="font-semibold text-sand">{item.material}</span>
                  {item.dims && <span className="text-metallic ml-2">— {item.dims}</span>}
                  <span className="text-metallic ml-2">× {item.quantity}</span>
                </div>
                <button
                  onClick={() =>
                    update((w) => ({ ...w, scrap: w.scrap.filter((x) => x.id !== item.id) }))
                  }
                  className="text-warning hover:text-red-500 text-sm"
                >
                  Used up
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="bg-gray-900 rounded-lg p-4 grid md:grid-cols-4 gap-2">
          <input
            value={scrapMaterial}
            onChange={(e) => setScrapMaterial(e.target.value)}
            placeholder="Material (e.g., cedar picket offcut)"
            className="input md:col-span-2"
          />
          <input
            value={scrapDims}
            onChange={(e) => setScrapDims(e.target.value)}
            placeholder="Size-ish (e.g., ~2' each)"
            className="input"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={scrapQty}
              onChange={(e) => setScrapQty(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddScrap()}
              className="input w-20"
            />
            <button onClick={handleAddScrap} className="btn-primary flex-1">
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="card">
        <h3 className="text-xl font-bold text-heartwood mb-4">🛠️ Tools</h3>
        {workshop.tools.length > 0 && (
          <div className="space-y-2 mb-4">
            {workshop.tools.map((tool) => (
              <div key={tool.id} className="flex justify-between items-center bg-gray-900 rounded-lg p-3">
                <div>
                  <span className="font-semibold text-sand">{tool.name}</span>
                  {tool.category && <span className="text-metallic text-sm ml-2">({tool.category})</span>}
                </div>
                <button
                  onClick={() =>
                    update((w) => ({ ...w, tools: w.tools.filter((x) => x.id !== tool.id) }))
                  }
                  className="text-warning hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="bg-gray-900 rounded-lg p-4 grid md:grid-cols-4 gap-2">
          <input
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            placeholder="Tool (e.g., japanese pull saw)"
            className="input md:col-span-2"
          />
          <input
            value={toolCategory}
            onChange={(e) => setToolCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTool()}
            placeholder="Category (optional)"
            className="input"
          />
          <button onClick={handleAddTool} className="btn-primary">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
