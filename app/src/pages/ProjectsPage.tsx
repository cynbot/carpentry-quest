import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../contexts/WorkshopContext';
import { exportWorkshop, importWorkshop } from '../utils/workshopStorage';
import { newId, STATUS_LABELS, type Project } from '../types/workshop';

export function ProjectsPage() {
  const { workshop, update, replaceWorkshop } = useWorkshop();
  const [newName, setNewName] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const project: Project = {
      id: newId(),
      name,
      status: 'dreaming',
      parts: [],
      materials: [],
      shopping: [],
      journal: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    update((w) => ({ ...w, projects: [project, ...w.projects] }));
    setNewName('');
  };

  const handleExport = () => {
    const blob = new Blob([exportWorkshop(workshop)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heartwood-workshop-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    const text = await file.text();
    const result = importWorkshop(text);
    if ('error' in result) {
      setImportError(result.error);
      return;
    }
    if (
      workshop.projects.length > 0 &&
      !window.confirm('Importing replaces the current workshop. Export a backup first if you want one. Continue?')
    ) {
      return;
    }
    setImportError('');
    replaceWorkshop(result);
  };

  const dreamName = (dreamId?: string) =>
    workshop.dreams.find((d) => d.id === dreamId)?.name;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-heartwood rounded-full" />
          <h2 className="text-3xl font-bold">Projects</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary text-sm py-2">
            ⬆ Export workshop
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-sm py-2">
            ⬇ Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportFile(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      {importError && (
        <div className="mb-4 p-3 rounded-lg bg-warning/20 border border-warning text-sand">
          {importError}
        </div>
      )}

      <p className="text-metallic mb-6">
        Every project is a shared document — parts, shopping list, and a journal any
        collaborator can write in. Export the workshop to share it with a Claude;
        import what comes back.
      </p>

      <div className="bg-gray-900 rounded-lg p-4 mb-8 flex gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Start something… (e.g., Fold-flat picnic table)"
          className="input flex-1"
        />
        <button onClick={handleCreate} className="btn-primary">
          Create
        </button>
      </div>

      {workshop.projects.length === 0 ? (
        <div className="card text-center text-metallic py-12">
          <div className="text-4xl mb-3">🪵</div>
          <p>No projects yet. Start one above, or let the 🎰 Roulette start one for you.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {workshop.projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="card hover:border-heartwood/60 transition-colors block"
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-xl font-bold text-sand">{project.name}</h3>
                <span className="text-sm text-metallic whitespace-nowrap">
                  {STATUS_LABELS[project.status]}
                </span>
              </div>
              {project.description && (
                <p className="text-metallic text-sm mt-2 line-clamp-2">{project.description}</p>
              )}
              <div className="flex gap-4 mt-3 text-sm text-metallic">
                <span>{project.parts.length} parts</span>
                <span>{project.shopping.length} to buy</span>
                <span>{project.journal.length} journal entries</span>
              </div>
              {project.dreamId && dreamName(project.dreamId) && (
                <div className="mt-2 text-sm text-moss">🌳 feeds “{dreamName(project.dreamId)}”</div>
              )}
              {project.seed && (
                <div className="mt-2 text-xs text-heartwood">
                  🎰 {project.seed.material} · {project.seed.form} · {project.seed.twist}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
