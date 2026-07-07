import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useWorkshop } from '../contexts/WorkshopContext';
import { newId, STATUS_LABELS, type Part, type ProjectStatus, type ShoppingItem } from '../types/workshop';
import { parseFraction, fractionToDecimal, decimalToFraction, formatFraction } from '../utils/fractionMath';
import { calculateCutPlan, formatLength, COMMON_BOARD_LENGTHS, COMMON_SAW_KERFS } from '../utils/cutListCalculator';

/** Parse inches with carpentry fractions: "3.5", "3-1/2", "5/8", "12". */
function parseInches(input: string): number | null {
  const fraction = parseFraction(input.trim());
  if (!fraction) return null;
  const value = fractionToDecimal(fraction);
  return value > 0 ? value : null;
}

function formatInches(value: number): string {
  return `${formatFraction(decimalToFraction(value))}"`;
}

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workshop, update, updateProject, addJournalEntry } = useWorkshop();
  const project = workshop.projects.find((p) => p.id === id);

  const [partName, setPartName] = useState('');
  const [partRole, setPartRole] = useState('');
  const [partLength, setPartLength] = useState('');
  const [partWidth, setPartWidth] = useState('');
  const [partThickness, setPartThickness] = useState('');
  const [partQty, setPartQty] = useState('1');
  const [partError, setPartError] = useState('');

  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('1');
  const [itemPrice, setItemPrice] = useState('');
  const [itemUrl, setItemUrl] = useState('');
  const [itemSource, setItemSource] = useState('');

  const [journalAuthor, setJournalAuthor] = useState<'human' | 'claude'>('human');
  const [journalText, setJournalText] = useState('');

  const [boardLength, setBoardLength] = useState(96);
  const [sawKerf, setSawKerf] = useState(0.125);
  const [showCutPlan, setShowCutPlan] = useState(false);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card text-center text-metallic py-12">
          <p>That project isn’t in the workshop.</p>
          <Link to="/" className="text-heartwood hover:underline mt-2 inline-block">
            ← Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const handleAddPart = () => {
    const length = parseInches(partLength);
    if (!partName.trim() || !length) {
      setPartError('A part needs a name and a length (inches — “3-1/2”, “5/8”, or “12”).');
      return;
    }
    const width = partWidth.trim() ? parseInches(partWidth) : null;
    const thickness = partThickness.trim() ? parseInches(partThickness) : null;
    const quantity = Math.max(1, parseInt(partQty) || 1);
    const part: Part = {
      id: newId(),
      name: partName.trim(),
      role: partRole.trim() || undefined,
      dims: {
        length,
        ...(width ? { width } : {}),
        ...(thickness ? { thickness } : {}),
      },
      quantity,
    };
    updateProject(project.id, (p) => ({ ...p, parts: [...p.parts, part] }));
    setPartName('');
    setPartRole('');
    setPartLength('');
    setPartWidth('');
    setPartThickness('');
    setPartQty('1');
    setPartError('');
    setShowCutPlan(false);
  };

  const handleAddItem = () => {
    if (!itemName.trim()) return;
    const price = parseFloat(itemPrice);
    const item: ShoppingItem = {
      id: newId(),
      name: itemName.trim(),
      quantity: Math.max(1, parseInt(itemQty) || 1),
      ...(Number.isFinite(price) && price >= 0 && itemPrice.trim()
        ? { unitPrice: price, priceAsOf: new Date().toISOString().slice(0, 10) }
        : {}),
      ...(itemUrl.trim() ? { url: itemUrl.trim() } : {}),
      ...(itemSource.trim() ? { source: itemSource.trim() } : {}),
      acquired: false,
    };
    updateProject(project.id, (p) => ({ ...p, shopping: [...p.shopping, item] }));
    setItemName('');
    setItemQty('1');
    setItemPrice('');
    setItemUrl('');
    setItemSource('');
  };

  const handleAddJournal = () => {
    const text = journalText.trim();
    if (!text) return;
    addJournalEntry(project.id, journalAuthor, text);
    setJournalText('');
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete “${project.name}”? Its journal goes with it.`)) return;
    update((w) => ({ ...w, projects: w.projects.filter((p) => p.id !== project.id) }));
    navigate('/');
  };

  const cutPlan = showCutPlan
    ? calculateCutPlan(
        project.parts.map((part) => ({
          id: part.id,
          length: part.dims.length,
          quantity: part.quantity,
          label: part.name,
        })),
        boardLength,
        sawKerf
      )
    : null;

  const estimatedTotal = project.shopping.reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-start gap-3 flex-wrap">
          <div>
            <Link to="/" className="text-sm text-metallic hover:text-white">
              ← Projects
            </Link>
            <h2 className="text-3xl font-bold text-sand mt-1">{project.name}</h2>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <select
              value={project.status}
              onChange={(e) =>
                updateProject(project.id, (p) => ({ ...p, status: e.target.value as ProjectStatus }))
              }
              className="input text-sm"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={project.dreamId ?? ''}
              onChange={(e) =>
                updateProject(project.id, (p) => ({ ...p, dreamId: e.target.value || undefined }))
              }
              className="input text-sm"
              title="Which dream does this project feed?"
            >
              <option value="">🌳 feeds no dream yet</option>
              {workshop.dreams.map((dream) => (
                <option key={dream.id} value={dream.id}>
                  🌳 feeds “{dream.name}”
                </option>
              ))}
            </select>
            <button onClick={handleDelete} className="text-warning hover:text-red-500 text-sm px-2">
              Delete
            </button>
          </div>
        </div>
        <textarea
          value={project.description ?? ''}
          onChange={(e) =>
            updateProject(project.id, (p) => ({ ...p, description: e.target.value || undefined }))
          }
          placeholder="What is this thing, and who is it for?"
          className="input w-full mt-4 min-h-[60px]"
        />
        {project.seed && (
          <div className="mt-3 text-sm text-heartwood bg-gray-900 rounded-lg p-3">
            🎰 Born from a spin: <span className="text-sand">{project.seed.material}</span> ·{' '}
            <span className="text-sand">{project.seed.form}</span> ·{' '}
            <span className="text-sand">{project.seed.technique}</span> ·{' '}
            <span className="text-sand">{project.seed.twist}</span>
          </div>
        )}
      </div>

      {/* Parts */}
      <div className="card">
        <h3 className="text-xl font-bold text-heartwood mb-4">Parts</h3>
        {project.parts.length > 0 && (
          <div className="space-y-2 mb-4">
            {project.parts.map((part) => (
              <div key={part.id} className="flex justify-between items-center bg-gray-900 rounded-lg p-3">
                <div>
                  <span className="font-semibold text-sand">{part.name}</span>
                  {part.role && <span className="text-metallic text-sm ml-2">({part.role})</span>}
                  <span className="text-metallic mx-2">—</span>
                  <span className="font-mono text-white">
                    {formatInches(part.dims.length)}
                    {part.dims.width ? ` × ${formatInches(part.dims.width)}` : ''}
                    {part.dims.thickness ? ` × ${formatInches(part.dims.thickness)}` : ''}
                  </span>
                  <span className="text-metallic ml-2">× {part.quantity}</span>
                </div>
                <button
                  onClick={() =>
                    updateProject(project.id, (p) => ({
                      ...p,
                      parts: p.parts.filter((x) => x.id !== part.id),
                    }))
                  }
                  className="text-warning hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="grid md:grid-cols-6 gap-2">
            <input value={partName} onChange={(e) => setPartName(e.target.value)} placeholder="Part name" className="input md:col-span-2" />
            <input value={partRole} onChange={(e) => setPartRole(e.target.value)} placeholder="Role (optional)" className="input" />
            <input value={partLength} onChange={(e) => setPartLength(e.target.value)} placeholder='Length"' className="input font-mono" />
            <input value={partWidth} onChange={(e) => setPartWidth(e.target.value)} placeholder='Width" (opt)' className="input font-mono" />
            <input value={partThickness} onChange={(e) => setPartThickness(e.target.value)} placeholder='Thick" (opt)' className="input font-mono" />
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              min="1"
              value={partQty}
              onChange={(e) => setPartQty(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPart()}
              placeholder="Qty"
              className="input w-24"
            />
            <button onClick={handleAddPart} className="btn-primary flex-1">
              Add part
            </button>
          </div>
          {partError && <p className="text-warning text-sm mt-2">{partError}</p>}
        </div>

        {/* Cut plan from parts */}
        {project.parts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-metallic/20">
            <div className="flex gap-2 items-center flex-wrap">
              <select value={boardLength} onChange={(e) => { setBoardLength(parseInt(e.target.value)); setShowCutPlan(false); }} className="input text-sm">
                {COMMON_BOARD_LENGTHS.map((b) => (
                  <option key={b.inches} value={b.inches}>{b.feet}' stock</option>
                ))}
              </select>
              <select value={sawKerf} onChange={(e) => { setSawKerf(parseFloat(e.target.value)); setShowCutPlan(false); }} className="input text-sm">
                {COMMON_SAW_KERFS.map((k) => (
                  <option key={k.inches} value={k.inches}>{k.name}</option>
                ))}
              </select>
              <button onClick={() => setShowCutPlan(true)} className="btn-secondary text-sm py-2">
                🪚 Plan cuts from parts
              </button>
            </div>
            {cutPlan && (
              <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-heartwood">{cutPlan.totalBoardsNeeded}</div>
                  <div className="text-xs text-metallic">boards of {boardLength / 12}' stock</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-warning">{formatLength(cutPlan.totalWaste)}</div>
                  <div className="text-xs text-metallic">total offcut</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="text-2xl font-bold text-sand">{cutPlan.wastePercentage.toFixed(1)}%</div>
                  <div className="text-xs text-metallic">waste (lengths only)</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shopping list */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-heartwood">Shopping list</h3>
          {estimatedTotal > 0 && (
            <span className="text-sand font-mono">~${estimatedTotal.toFixed(2)}</span>
          )}
        </div>
        {project.shopping.length > 0 && (
          <div className="space-y-2 mb-4">
            {project.shopping.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-900 rounded-lg p-3">
                <input
                  type="checkbox"
                  checked={item.acquired}
                  onChange={() =>
                    updateProject(project.id, (p) => ({
                      ...p,
                      shopping: p.shopping.map((x) =>
                        x.id === item.id ? { ...x, acquired: !x.acquired } : x
                      ),
                    }))
                  }
                  className="w-5 h-5 accent-heartwood"
                />
                <div className={`flex-1 ${item.acquired ? 'line-through text-metallic' : ''}`}>
                  <span className="font-semibold text-sand">{item.name}</span>
                  <span className="text-metallic ml-2">× {item.quantity}</span>
                  {item.unitPrice !== undefined && (
                    <span className="font-mono text-white ml-3">${item.unitPrice.toFixed(2)}</span>
                  )}
                  {item.source && <span className="text-metallic text-sm ml-2">@ {item.source}</span>}
                  {item.priceAsOf && (
                    <span className="text-metallic/70 text-xs ml-2">price as of {item.priceAsOf}</span>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-heartwood hover:underline text-sm ml-2"
                    >
                      link ↗
                    </a>
                  )}
                </div>
                <button
                  onClick={() =>
                    updateProject(project.id, (p) => ({
                      ...p,
                      shopping: p.shopping.filter((x) => x.id !== item.id),
                    }))
                  }
                  className="text-warning hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="bg-gray-900 rounded-lg p-4 grid md:grid-cols-6 gap-2">
          <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item" className="input md:col-span-2" />
          <input type="number" min="1" value={itemQty} onChange={(e) => setItemQty(e.target.value)} placeholder="Qty" className="input" />
          <input value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="$ each" className="input font-mono" />
          <input value={itemSource} onChange={(e) => setItemSource(e.target.value)} placeholder="Store" className="input" />
          <button onClick={handleAddItem} className="btn-primary">Add</button>
          <input
            value={itemUrl}
            onChange={(e) => setItemUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="Product URL (optional — live prices arrive in Phase 2)"
            className="input md:col-span-6"
          />
        </div>
      </div>

      {/* Journal */}
      <div className="card">
        <h3 className="text-xl font-bold text-heartwood mb-1">Shop journal</h3>
        <p className="text-metallic text-sm mb-4">
          Shared memory. Anyone who works on this project — you or a Claude — leaves notes here.
        </p>
        {project.journal.length > 0 && (
          <div className="space-y-3 mb-4">
            {project.journal.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-lg p-3 border-l-4 ${
                  entry.author === 'claude'
                    ? 'bg-gray-900 border-moss'
                    : 'bg-gray-900 border-heartwood'
                }`}
              >
                <div className="flex justify-between text-xs text-metallic mb-1">
                  <span className="font-semibold">
                    {entry.author === 'claude' ? '✶ claude' : entry.author === 'human' ? '🧑 you' : entry.author}
                  </span>
                  <span>{new Date(entry.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-white whitespace-pre-wrap">{entry.text}</p>
              </div>
            ))}
          </div>
        )}
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setJournalAuthor('human')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                journalAuthor === 'human' ? 'bg-heartwood text-charcoal' : 'bg-gray-700 text-metallic'
              }`}
            >
              🧑 you
            </button>
            <button
              onClick={() => setJournalAuthor('claude')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                journalAuthor === 'claude' ? 'bg-moss text-charcoal' : 'bg-gray-700 text-metallic'
              }`}
            >
              ✶ claude
            </button>
          </div>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Dry-fit revealed the lid needs 2mm clearance…"
            className="input w-full min-h-[80px]"
          />
          <button onClick={handleAddJournal} className="btn-primary w-full mt-2">
            Add entry
          </button>
        </div>
      </div>
    </div>
  );
}
