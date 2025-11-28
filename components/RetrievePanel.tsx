import React, { useState } from 'react';
import { RetrievalData } from '../types';

interface RetrievePanelProps {
  onComplete: (data: RetrievalData) => void;
}

export const RetrievePanel: React.FC<RetrievePanelProps> = ({ onComplete }) => {
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [classification, setClassification] = useState<RetrievalData['classification']>('UNCLASSIFIED');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !source.trim()) return;

    onComplete({
      content,
      source,
      classification,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Retrieval Phase</h2>
        <p className="text-slate-400 mb-6">Ingest structured or unstructured intelligence data for processing.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Source Origin
              </label>
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Internal Memo, OSINT Feed, Employee Report"
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Classification Level
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as RetrievalData['classification'])}
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              >
                <option value="UNCLASSIFIED">Unclassified</option>
                <option value="CONFIDENTIAL">Confidential</option>
                <option value="SECRET">Secret</option>
                <option value="TOP_SECRET">Top Secret</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Intelligence Content
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw data text here..."
              rows={8}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors font-mono text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
            >
              Initiate Analysis &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
