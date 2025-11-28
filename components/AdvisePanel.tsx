import React from 'react';
import { Recommendation } from '../types';

interface AdvisePanelProps {
  advice: Recommendation[];
  isLoading: boolean;
  onContinue: () => void;
}

export const AdvisePanel: React.FC<AdvisePanelProps> = ({ advice, isLoading, onContinue }) => {
  if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4 animate-pulse">
            <div className="flex space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-cyan-400 font-mono text-lg">GENERATING STRATEGIC ADVISORY...</p>
            <p className="text-slate-500 text-sm">Cross-referencing findings with mitigation strategies</p>
        </div>
      );
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
        case 'CRITICAL': return 'border-red-500 bg-red-900/10 text-red-400';
        case 'HIGH': return 'border-orange-500 bg-orange-900/10 text-orange-400';
        case 'MEDIUM': return 'border-yellow-500 bg-yellow-900/10 text-yellow-400';
        default: return 'border-blue-500 bg-blue-900/10 text-blue-400';
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
        <h2 className="text-2xl font-bold text-white mb-6">Strategic Recommendations</h2>
        
        <div className="grid gap-6 mb-8">
            {advice.map((item, idx) => (
                <div 
                    key={idx} 
                    className={`p-6 rounded-lg border-l-4 bg-slate-800 shadow-lg transition-transform hover:-translate-y-1 ${getPriorityColor(item.priority)}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-100">{item.title}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wide ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                        </span>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">{item.description}</p>
                    {item.frameworkReference && (
                        <div className="flex items-center text-xs text-slate-500 font-mono bg-slate-900/50 p-2 rounded inline-block">
                            <span className="font-bold mr-2">REF:</span> {item.frameworkReference}
                        </div>
                    )}
                </div>
            ))}
        </div>

        <div className="flex justify-end">
            <button
                onClick={onContinue}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
            >
                View Final Report &rarr;
            </button>
        </div>
    </div>
  );
};
