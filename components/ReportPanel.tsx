import React from 'react';
import { RadarState } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ReportPanelProps {
  state: RadarState;
}

export const ReportPanel: React.FC<ReportPanelProps> = ({ state }) => {
  const { retrieval, analysis, advice } = state;
  if (!analysis) return null;

  // Mock efficiency metrics
  const metricsData = [
    { name: 'Accuracy', value: 98 },
    { name: 'Compliance', value: 92 },
    { name: 'Speed', value: 85 },
    { name: 'Traceability', value: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-12">
        <div className="flex justify-between items-end mb-8 border-b border-slate-700 pb-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Final Intelligence Report</h1>
                <p className="text-slate-400">Generated via R.A.D.A.R. Methodology</p>
            </div>
            <button 
                onClick={() => window.print()}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded flex items-center space-x-2 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export PDF</span>
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* High Level Stats */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-4">Risk Profile</h3>
                <div className="text-5xl font-bold text-white mb-2">{analysis.riskScore}</div>
                <div className="text-sm text-slate-400">Composite Risk Score</div>
                <div className="mt-6 pt-6 border-t border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300">Classification</span>
                        <span className="text-cyan-400 font-mono bg-cyan-900/30 px-2 py-1 rounded text-xs">{retrieval.classification}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-300">Action Items</span>
                        <span className="text-white font-bold">{advice.length}</span>
                    </div>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-4">Methodology Effectiveness Metrics</h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metricsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} stroke="#64748b" hide />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                cursor={{fill: '#334155', opacity: 0.4}}
                            />
                            <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-700">
                <h3 className="text-white font-bold">Action Plan Summary</h3>
            </div>
            <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/50 text-xs uppercase text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-3">Priority</th>
                        <th className="px-6 py-3">Recommendation</th>
                        <th className="px-6 py-3">Framework Reference</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {advice.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 
                                    ${item.priority === 'CRITICAL' ? 'bg-red-500' : 
                                      item.priority === 'HIGH' ? 'bg-orange-500' :
                                      item.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`}></span>
                                {item.priority}
                            </td>
                            <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">{item.frameworkReference || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="mt-8 text-center">
            <button 
                onClick={() => window.location.reload()}
                className="text-cyan-500 hover:text-cyan-400 text-sm font-semibold transition-colors"
            >
                Start New R.A.D.A.R. Session
            </button>
        </div>
    </div>
  );
};
