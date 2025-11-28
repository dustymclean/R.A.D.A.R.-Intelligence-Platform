import React from 'react';
import { AnalysisResult } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface AnalyzePanelProps {
  data: AnalysisResult | null;
  isLoading: boolean;
  onContinue: () => void;
}

export const AnalyzePanel: React.FC<AnalyzePanelProps> = ({ data, isLoading, onContinue }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 animate-pulse">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cyan-400 font-mono text-lg">ANALYZING INTELLIGENCE VECTOR...</p>
        <p className="text-slate-500 text-sm">Applying heuristic models and keyword extraction</p>
      </div>
    );
  }

  if (!data) return null;

  const riskData = [
    { name: 'Risk', value: data.riskScore },
    { name: 'Safety', value: 100 - data.riskScore },
  ];

  const getRiskColor = (score: number) => {
    if (score < 30) return '#22c55e'; // Green
    if (score < 70) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  const riskColor = getRiskColor(data.riskScore);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 flex flex-col items-center shadow-xl">
          <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-4">Calculated Risk Score</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={riskColor} />
                  <Cell fill="#334155" />
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-0 text-center mt-2">
              <span className="text-4xl font-bold text-white block">{data.riskScore}</span>
              <span className="text-xs text-slate-500 uppercase">/ 100</span>
            </div>
          </div>
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Low</span>
                <span>Critical</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-full opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 shadow-xl">
            <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-4">Executive Summary</h3>
            <p className="text-slate-200 leading-relaxed text-sm lg:text-base">
                {data.summary}
            </p>
            
            <div className="mt-6">
                <h4 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-3">Detected Entities</h4>
                <div className="flex flex-wrap gap-2">
                    {data.detectedEntities.map((entity, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-xs text-slate-300">
                            {entity}
                        </span>
                    ))}
                    {data.detectedEntities.length === 0 && <span className="text-slate-500 text-xs italic">No specific entities detected.</span>}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Keywords */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 shadow-xl">
             <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-4">Keyword Extraction</h3>
             <div className="flex flex-wrap gap-2">
                {data.keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-900/30 border border-cyan-800 text-cyan-400 rounded-full text-sm">
                        #{kw}
                    </span>
                ))}
             </div>
          </div>

          {/* Compliance */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 shadow-xl">
             <h3 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-4">Compliance Frameworks</h3>
             <ul className="space-y-2">
                {data.complianceTags.map((tag, i) => (
                    <li key={i} className="flex items-center text-slate-300 text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {tag}
                    </li>
                ))}
             </ul>
          </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
            onClick={onContinue}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
        >
            Proceed to Documentation &rarr;
        </button>
      </div>
    </div>
  );
};
