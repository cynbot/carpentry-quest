import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { WorkshopProvider } from './contexts/WorkshopContext';
import { FractionConverter } from './components/FractionConverter';
import { CutListCalculator } from './components/CutListCalculator';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { RoulettePage } from './pages/RoulettePage';
import { GrovePage } from './pages/GrovePage';
import { InventoryPage } from './pages/InventoryPage';
import { WorkbenchPage } from './pages/WorkbenchPage';

function App() {
  return (
    <WorkshopProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/roulette" element={<RoulettePage />} />
            <Route path="/grove" element={<GrovePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/workbench" element={<WorkbenchPage />} />
            <Route path="/tools/fractions" element={<FractionConverter />} />
            <Route path="/tools/cutlist" element={<CutListCalculator />} />
            <Route path="*" element={<ProjectsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WorkshopProvider>
  );
}

export default App;
