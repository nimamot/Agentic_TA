import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, ArrowRight, X, Cpu, FileInput, FileOutput, Settings, Zap } from 'lucide-react';
import { Stage, INITIAL_STAGES } from './DashboardView';

export default function SystemBlueprintView() {
  const [selectedNode, setSelectedNode] = useState<Stage | null>(null);

  return (
    <div className="flex-1 relative bg-slate-50 overflow-hidden flex flex-col h-full min-h-[600px]">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }} 
      />

      <div className="relative z-10 flex-1 flex items-center justify-center p-8 overflow-x-auto">
        <div className="flex items-center gap-4 min-w-max pb-12">
          {INITIAL_STAGES.map((stage, index) => (
            <React.Fragment key={stage.id}>
              {/* Agent Node */}
              <Node 
                stage={stage} 
                isSelected={selectedNode?.id === stage.id} 
                onClick={() => setSelectedNode(stage)} 
              />
              
              {/* Connector Arrow (except after last node) */}
              {index < INITIAL_STAGES.length - 1 && (
                <div className="flex items-center justify-center text-slate-300 w-12">
                   <motion.div 
                     initial={{ width: 0, opacity: 0 }}
                     animate={{ width: '100%', opacity: 1 }}
                     transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                     className="h-0.5 bg-slate-300 w-full relative"
                   >
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                       <ArrowRight className="w-4 h-4 text-slate-300" />
                     </div>
                   </motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Details Panel (Drawer) */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-20 flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <selectedNode.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedNode.name}</h3>
                  <p className="text-sm text-slate-500">{selectedNode.agentName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Role Description</h4>
                <p className="text-slate-700 leading-relaxed">{selectedNode.description}</p>
              </div>

              {/* Model Configuration */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                  <Cpu className="w-4 h-4 text-indigo-500" /> Model Configuration
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-slate-400 text-xs mb-1">Model</span>
                    <span className="font-mono text-slate-700">{selectedNode.model || "GPT-4"}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs mb-1">Temperature</span>
                    <span className="font-mono text-slate-700">{selectedNode.temperature || 0.7}</span>
                  </div>
                </div>
              </div>

              {/* Tools */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
                  <Settings className="w-4 h-4 text-amber-500" /> Connected Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.tools?.map((tool) => (
                    <span key={tool} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-medium">
                      {tool}
                    </span>
                  )) || <span className="text-slate-400 text-sm italic">No external tools connected</span>}
                </div>
              </div>

              {/* IO Flow */}
              <div className="space-y-4">
                 <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                      <FileInput className="w-4 h-4 text-blue-500" /> Inputs
                    </h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {selectedNode.inputs?.map(input => (
                        <li key={input}>{input}</li>
                      )) || <li>Previous Stage Output</li>}
                    </ul>
                 </div>
                 
                 <div className="flex justify-center">
                   <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                 </div>

                 <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                      <FileOutput className="w-4 h-4 text-emerald-500" /> Outputs
                    </h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {selectedNode.outputs?.map(output => (
                        <li key={output}>{output}</li>
                      )) || <li>Analysis Result</li>}
                    </ul>
                 </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Test This Agent
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Node({ stage, isSelected, onClick }: { stage: Stage, isSelected: boolean, onClick: () => void }) {
  return (
    <motion.div
      layoutId={`node-${stage.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-64 bg-white rounded-xl shadow-lg border-2 cursor-pointer transition-colors duration-200 flex flex-col overflow-hidden group
        ${isSelected ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100 hover:border-indigo-200'}
      `}
    >
      {/* Header / Agent Avatar */}
      <div className={`p-4 flex flex-col items-center gap-3 border-b border-slate-100
         ${isSelected ? 'bg-indigo-50/50' : 'bg-slate-50/50'}
      `}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-white
          ${isSelected ? 'bg-indigo-600' : 'bg-slate-400 group-hover:bg-indigo-500 transition-colors'}
        `}>
          <Bot className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-sm">{stage.agentName}</h3>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{stage.name}</span>
        </div>
      </div>

      {/* Mini Details */}
      <div className="p-4 bg-white">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Model</span>
            <span className="font-mono text-slate-600 font-medium">{stage.model?.split('-')[0] || "GPT-4"}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Tools</span>
            <span className="font-mono text-slate-600 font-medium">{stage.tools?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Status Dot */}
      <div className="absolute top-3 right-3">
        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-500' : 'bg-slate-300'}`} />
      </div>
    </motion.div>
  );
}
