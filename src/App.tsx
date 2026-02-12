import React, { useState } from 'react';
import { Database, LayoutDashboard, GitGraph } from 'lucide-react';
import DashboardView from './components/DashboardView';
import SystemBlueprintView from './components/SystemBlueprintView';

type ViewMode = 'dashboard' | 'blueprint';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
            <Database className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Grounded Theory Automator</h1>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Multi-Agent Workflow Orchestrator</p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 
              ${currentView === 'dashboard' 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
            `}
          >
            <LayoutDashboard className="w-4 h-4" />
            Live Dashboard
          </button>
          <button
            onClick={() => setCurrentView('blueprint')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 
              ${currentView === 'blueprint' 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
            `}
          >
            <GitGraph className="w-4 h-4" />
            System Blueprint
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">
        {currentView === 'dashboard' ? (
          <DashboardView />
        ) : (
          <SystemBlueprintView />
        )}
      </main>
    </div>
  );
}
