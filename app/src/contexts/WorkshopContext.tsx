import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { loadWorkshop, saveWorkshop } from '../utils/workshopStorage';
import { newId, type JournalEntry, type Project, type Workshop } from '../types/workshop';

interface WorkshopContextValue {
  workshop: Workshop;
  /** All mutations flow through here so persistence stays in one place. */
  update: (fn: (w: Workshop) => Workshop) => void;
  updateProject: (projectId: string, fn: (p: Project) => Project) => void;
  addJournalEntry: (projectId: string, author: string, text: string) => void;
  replaceWorkshop: (w: Workshop) => void;
}

const WorkshopContext = createContext<WorkshopContextValue | null>(null);

export function WorkshopProvider({ children }: { children: ReactNode }) {
  const [workshop, setWorkshop] = useState<Workshop>(loadWorkshop);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveWorkshop(workshop);
  }, [workshop]);

  const update = useCallback((fn: (w: Workshop) => Workshop) => {
    setWorkshop((current) => fn(current));
  }, []);

  const updateProject = useCallback((projectId: string, fn: (p: Project) => Project) => {
    setWorkshop((current) => ({
      ...current,
      projects: current.projects.map((p) =>
        p.id === projectId ? { ...fn(p), updatedAt: Date.now() } : p
      ),
    }));
  }, []);

  const addJournalEntry = useCallback(
    (projectId: string, author: string, text: string) => {
      const entry: JournalEntry = { id: newId(), author, text, createdAt: Date.now() };
      updateProject(projectId, (p) => ({ ...p, journal: [...p.journal, entry] }));
    },
    [updateProject]
  );

  const replaceWorkshop = useCallback((w: Workshop) => {
    setWorkshop(w);
  }, []);

  return (
    <WorkshopContext.Provider value={{ workshop, update, updateProject, addJournalEntry, replaceWorkshop }}>
      {children}
    </WorkshopContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkshop(): WorkshopContextValue {
  const ctx = useContext(WorkshopContext);
  if (!ctx) throw new Error('useWorkshop must be used within WorkshopProvider');
  return ctx;
}
