import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Overview } from './pages/Overview';
import { Batters } from './pages/Batters';
import { Bowlers } from './pages/Bowlers';
import { PlayerExplorer } from './pages/PlayerExplorer';
import { PlayerComparison } from './pages/PlayerComparison';
import { PressureIntelligence } from './pages/PressureIntelligence';
import { BowlingIntelligence } from './pages/BowlingIntelligence';
import { Methodology } from './pages/Methodology';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F7F8FA] text-[#17263C] flex flex-col font-sans">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto overflow-y-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/overview" element={<Navigate to="/" replace />} />
              <Route path="/batters" element={<Batters />} />
              <Route path="/bowlers" element={<Bowlers />} />
              <Route path="/players" element={<PlayerExplorer />} />
              <Route path="/compare" element={<PlayerComparison />} />
              <Route path="/pressure" element={<PressureIntelligence />} />
              <Route path="/bowling-intelligence" element={<BowlingIntelligence />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
