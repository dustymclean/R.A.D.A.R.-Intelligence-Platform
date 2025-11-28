import React, { useEffect, useState } from 'react';
import { DocumentationRecord } from '../types';

interface DocumentPanelProps {
  record: DocumentationRecord | null;
  onContinue: () => void;
}

export const DocumentPanel: React.FC<DocumentPanelProps> = ({ record, onContinue }) => {
  const [isHashing, setIsHashing] = useState(true);

  useEffect(() => {
    // Simulate hashing delay
    const timer = setTimeout(() => setIsHashing(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!record) return null;

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Immutable Record
            </h2>
            <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${isHashing ? 'bg-yellow-400 animate-ping' : 'bg-green-500'}`}></span>
                <span className="text-xs text-slate-400 uppercase font-mono">{isHashing ? 'CRYPTOGRAPHIC HASHING...' : 'VERIFIED'}</span>
            </div>
        </div>
        
        <div className="p-6 font-mono text-sm overflow-x-auto bg-[#0d1117] text-slate-300">
            {/* Metadata Header */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                    <span className="text-slate-500 block text-xs uppercase mb-1">Record ID</span>
                    <span className="text-cyan-400">{record.id}</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs uppercase mb-1">Timestamp</span>
                    <span>{record.timestamp}</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs uppercase mb-1">Author</span>
                    <span>{record.author}</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs uppercase mb-1">Integrity Hash</span>
                    <span className="break-all text-xs text-yellow-600/80">{isHashing ? 'Computing...' : record.hash}</span>
                </div>
            </div>

            {/* JSON Content */}
            <pre className="text-xs md:text-sm text-green-400/90">
                {JSON.stringify(record.structuredData, null, 2)}
            </pre>
        </div>

        <div className="bg-slate-800 px-6 py-4 border-t border-slate-700 flex justify-between items-center">
            <span className="text-xs text-slate-500">
                Stored in PostgreSQL • Audit Log #2024-Q3-882
            </span>
            <button
                disabled={isHashing}
                onClick={onContinue}
                className={`px-6 py-2 bg-cyan-600 text-white font-semibold rounded shadow transition-all
                    ${isHashing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-500 hover:scale-105'}
                `}
            >
                Generate Advisory &rarr;
            </button>
        </div>
      </div>
    </div>
  );
};
