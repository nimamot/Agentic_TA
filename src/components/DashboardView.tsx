import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Circle, ArrowRight, Brain, FileText, List, Layers, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types for our workflow
export type StageStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface Stage {
  id: number;
  name: string;
  agentName: string;
  description: string;
  icon: React.ElementType;
  status: StageStatus;
  logs: string[];
  output: string | null;
  // Details for the blueprint view
  model?: string;
  temperature?: number;
  tools?: string[];
  inputs?: string[];
  outputs?: string[];
}

export const INITIAL_STAGES: Stage[] = [
  {
    id: 1,
    name: 'Open Coding',
    agentName: 'Analyst Agent',
    description: 'Breaks down raw data into discrete parts, examining interactions and events.',
    icon: FileText,
    status: 'idle',
    logs: [],
    output: null,
    model: "GPT-4o",
    temperature: 0.2,
    tools: ["Text Splitter", "Keyword Extractor"],
    inputs: ["Raw Transcripts", "Field Notes", "Research Question"],
    outputs: ["Initial Codes", "Memo Drafts"]
  },
  {
    id: 2,
    name: 'Axial Coding [2]',
    agentName: 'Synthesizer Agent',
    description: 'Relates categories to subcategories, testing relationships against data.',
    icon: Layers,
    status: 'idle',
    logs: [],
    output: null,
    model: "Claude 3.5 Sonnet",
    temperature: 0.4,
    tools: ["Relationship Mapper", "Vector Search"],
    inputs: ["Initial Codes", "Context Tags"],
    outputs: ["Axial Categories", "Relationship Graph"]
  },
  {
    id: 3,
    name: 'Selective Coding',
    agentName: 'Architect Agent',
    description: 'Unifies categories around a core "story" or central category.',
    icon: List,
    status: 'idle',
    logs: [],
    output: null,
    model: "GPT-4o",
    temperature: 0.5,
    tools: ["Theme Aggregator", "Narrative Builder"],
    inputs: ["Axial Categories", "Memos"],
    outputs: ["Core Category", "Storyline"]
  },
  {
    id: 4,
    name: 'Theory Formulation',
    agentName: 'Theorist Agent',
    description: 'Constructs the grounded theory based on the core categories and relationships.',
    icon: Brain,
    status: 'idle',
    logs: [],
    output: null,
    model: "o1-preview",
    temperature: 0.7,
    tools: ["Logic Validator", "Proposition Generator"],
    inputs: ["Core Category", "Relationships"],
    outputs: ["Theoretical Framework", "Propositions"]
  },
  {
    id: 5,
    name: 'Validation & Reporting',
    agentName: 'Reviewer Agent',
    description: 'Validates the theory against raw data and generates the final report.',
    icon: PenTool,
    status: 'idle',
    logs: [],
    output: null,
    model: "GPT-4o-mini",
    temperature: 0.1,
    tools: ["Citation Checker", "Report Formatter"],
    inputs: ["Theoretical Framework", "Raw Data"],
    outputs: ["Final Report", "Validation Score"]
  }, 
    {
    id: 6,
    name: 'Validation & Reporting',
    agentName: 'Reviewer Agent',
    description: 'Validates the theory against raw data and generates the final report.',
    icon: PenTool,
    status: 'idle',
    logs: [],
    output: null,
    model: "GPT-4o-mini",
    temperature: 0.1,
    tools: ["Citation Checker", "Report Formatter"],
    inputs: ["Theoretical Framework", "Raw Data"],
    outputs: ["Final Report", "Validation Score"]
  }
];

export default function DashboardView() {
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [activeStageId, setActiveStageId] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<number>(1);

  // Simulation logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && activeStageId !== null) {
      interval = setInterval(() => {
        setStages(prev => {
          const newStages = [...prev];
          const activeIndex = newStages.findIndex(s => s.id === activeStageId);
          if (activeIndex === -1) return prev;

          const stage = newStages[activeIndex];
          
          const mockLogs = [
            "Analyzing semantic patterns...",
            "Querying vector database...",
            "Identifying key themes in segment...",
            "Cross-referencing with previous context...",
            "Optimizing token usage...",
            "Generating intermediate reasoning..."
          ];

          if (stage.status !== 'processing') {
            stage.status = 'processing';
          }

          if (Math.random() > 0.7) {
            stage.logs = [...stage.logs, mockLogs[Math.floor(Math.random() * mockLogs.length)]];
          }

          if (stage.logs.length > 8) {
             stage.status = 'completed';
             stage.output = `Generated output for ${stage.name}. Ready for next agent.`;
             
             if (activeStageId < 5) {
               setTimeout(() => setActiveStageId(activeStageId + 1), 1000);
             } else {
               setIsRunning(false);
               setActiveStageId(null);
             }
          }

          return newStages;
        });
      }, 800);
    }

    return () => clearInterval(interval);
  }, [isRunning, activeStageId]);

  const handleStart = () => {
    if (activeStageId === null) {
      setActiveStageId(1);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveStageId(null);
    setStages(INITIAL_STAGES);
    setSelectedStageId(1);
  };

  const selectedStage = stages.find(s => s.id === selectedStageId);

  return (
    <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
      
      {/* Control Bar included in the view for now, or could be lifted */}
      <div className="lg:col-span-12 flex justify-end gap-3 mb-4">
          {!isRunning && stages.every(s => s.status === 'idle') ? (
            <button 
              onClick={handleStart}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              <Play className="w-4 h-4" /> Start Workflow
            </button>
          ) : isRunning ? (
            <button 
              onClick={handlePause}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
          ) : (
            <button 
               onClick={handleStart}
               disabled={stages.every(s => s.status === 'completed')}
               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" /> Resume
            </button>
          )}

          <button 
            onClick={handleReset}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
      </div>

      {/* Left Column: Workflow Timeline */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" /> Pipeline Stages
          </h2>
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>
            
            <div className="space-y-6 relative z-10">
              {stages.map((stage) => {
                const isActive = activeStageId === stage.id;
                const isCompleted = stage.status === 'completed';
                const isSelected = selectedStageId === stage.id;
                
                return (
                  <div 
                    key={stage.id} 
                    className={`group relative flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 
                      ${isSelected ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}
                    `}
                    onClick={() => setSelectedStageId(stage.id)}
                  >
                    {/* Status Icon */}
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                      ${isActive ? 'bg-indigo-600 border-indigo-600' : 
                        isCompleted ? 'bg-emerald-500 border-emerald-500' : 
                        'bg-white border-slate-300'}
                    `}>
                      {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : 
                       isActive ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Circle className="w-5 h-5 text-white border-t-transparent" /></motion.div> :
                       <span className="text-sm font-bold text-slate-500">{stage.id}</span>}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{stage.name}</h3>
                        {isActive && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Active</span>}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{stage.agentName}</p>
                    </div>
                    
                    {isSelected && (
                       <div className="absolute right-3 top-1/2 -translate-y-1/2">
                         <ArrowRight className="w-4 h-4 text-indigo-400" />
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Active Stage Details */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {selectedStage ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedStage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 h-full"
            >
              {/* Agent Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <div className="flex items-start justify-between mb-6">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                       <selectedStage.icon className="w-8 h-8" />
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-slate-900">{selectedStage.name}</h2>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600">
                            Agent: {selectedStage.agentName}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded capitalize
                            ${selectedStage.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                              selectedStage.status === 'processing' ? 'bg-amber-100 text-amber-700' : 
                              'bg-slate-100 text-slate-500'}
                          `}>
                            {selectedStage.status}
                          </span>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <p className="text-slate-600 leading-relaxed max-w-2xl">
                   {selectedStage.description}
                 </p>
              </div>

              {/* Console / Output Area */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
                {/* Terminal Log */}
                <div className="bg-slate-900 rounded-xl overflow-hidden flex flex-col shadow-inner">
                  <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                    <span className="text-xs font-mono text-slate-400">Agent Activity Log</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                    </div>
                  </div>
                  <div className="flex-1 p-4 font-mono text-sm text-emerald-400 overflow-y-auto max-h-[400px]">
                    {selectedStage.logs.length === 0 ? (
                      <span className="text-slate-600 opacity-50">Waiting for process to start...</span>
                    ) : (
                      <div className="flex flex-col gap-2">
                         {selectedStage.logs.map((log, i) => (
                           <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex gap-2"
                           >
                             <span className="text-slate-500 select-none">$</span>
                             <span>{log}</span>
                           </motion.div>
                         ))}
                         {selectedStage.status === 'processing' && (
                           <motion.div 
                             animate={{ opacity: [0, 1, 0] }} 
                             transition={{ repeat: Infinity, duration: 0.8 }}
                             className="w-2 h-4 bg-emerald-400"
                           />
                         )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Output Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Artifacts</span>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto">
                    {selectedStage.output ? (
                      <div className="prose prose-sm max-w-none">
                        <h4 className="text-lg font-medium text-slate-900 mb-2">Output Generated</h4>
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900">
                           {selectedStage.output}
                           <p className="mt-2 text-sm text-indigo-700 opacity-80">
                             [Detailed analysis data would appear here, including specific codes, categorical relationships, or theoretical memos extracted from the source material.]
                           </p>
                        </div>
                      </div>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                         <div className="p-3 bg-slate-100 rounded-full">
                           <List className="w-6 h-6" />
                         </div>
                         <p className="text-sm">No output generated yet</p>
                       </div>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        ) : (
           <div className="h-full flex items-center justify-center text-slate-400">
             Select a stage to view details
           </div>
        )}
      </div>
    </div>
  );
}
