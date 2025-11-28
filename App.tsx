import React, { useState } from 'react';
import { StageStepper } from './components/StageStepper';
import { RetrievePanel } from './components/RetrievePanel';
import { AnalyzePanel } from './components/AnalyzePanel';
import { DocumentPanel } from './components/DocumentPanel';
import { AdvisePanel } from './components/AdvisePanel';
import { ReportPanel } from './components/ReportPanel';
import { RadarState, RadarStage, RetrievalData, AnalysisResult, DocumentationRecord, Recommendation } from './types';
import { analyzeContent, generateAdvice } from './services/geminiService';

const initialState: RadarState = {
  currentStage: RadarStage.RETRIEVE,
  retrieval: { content: '', source: '', timestamp: '', classification: 'UNCLASSIFIED' },
  analysis: null,
  documentation: null,
  advice: [],
  isProcessing: false,
  error: null,
};

const App: React.FC = () => {
  const [state, setState] = useState<RadarState>(initialState);

  // Helper to update specific parts of state
  const updateState = (updates: Partial<RadarState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Stage 1: Handle Retrieval Completion -> Trigger Analysis
  const handleRetrievalComplete = async (data: RetrievalData) => {
    updateState({ 
      retrieval: data, 
      currentStage: RadarStage.ANALYZE, 
      isProcessing: true,
      error: null
    });

    try {
      // Call Gemini for Analysis
      const analysisResult = await analyzeContent(data);
      updateState({ 
        analysis: analysisResult, 
        isProcessing: false 
      });
    } catch (err) {
      updateState({ 
        isProcessing: false, 
        error: "Failed to analyze content. Please verify API configuration." 
      });
    }
  };

  // Stage 2: Handle Analysis Review -> Trigger Documentation
  const handleAnalysisComplete = () => {
    if (!state.analysis) return;

    // Create Immutable Record
    const record: DocumentationRecord = {
      id: crypto.randomUUID().split('-')[0].toUpperCase(),
      hash: "SHA256-" + Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join(''),
      timestamp: new Date().toISOString(),
      author: 'SYSTEM_AUTONOMOUS_AGENT',
      structuredData: { ...state.analysis, ...state.retrieval }
    };

    updateState({
      documentation: record,
      currentStage: RadarStage.DOCUMENT
    });
  };

  // Stage 3: Handle Documentation Verified -> Trigger Advice
  const handleDocumentationComplete = async () => {
    updateState({ 
      currentStage: RadarStage.ADVISE,
      isProcessing: true,
      error: null
    });

    try {
      if (!state.analysis) throw new Error("No analysis data found");
      const adviceResult = await generateAdvice(state.analysis);
      updateState({
        advice: adviceResult,
        isProcessing: false
      });
    } catch (err) {
      updateState({
        isProcessing: false,
        error: "Failed to generate advice."
      });
    }
  };

  // Stage 4: Handle Advice Reviewed -> Show Report
  const handleAdviceComplete = () => {
    updateState({ currentStage: RadarStage.REPORT });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-wider">R.A.D.A.R.</h1>
                    <p className="text-[0.6rem] text-slate-400 uppercase tracking-widest -mt-1">Structured Intelligence Engine</p>
                </div>
            </div>
            <div className="text-xs text-slate-500 font-mono hidden md:block">
                MVP v1.0 • SYSTEM STATUS: ONLINE
            </div>
        </div>
      </header>

      <StageStepper currentStage={state.currentStage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {state.error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded mb-8 flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {state.error}
            </div>
        )}

        {state.currentStage === RadarStage.RETRIEVE && (
            <RetrievePanel onComplete={handleRetrievalComplete} />
        )}

        {state.currentStage === RadarStage.ANALYZE && (
            <AnalyzePanel 
                data={state.analysis} 
                isLoading={state.isProcessing} 
                onContinue={handleAnalysisComplete} 
            />
        )}

        {state.currentStage === RadarStage.DOCUMENT && (
            <DocumentPanel 
                record={state.documentation} 
                onContinue={handleDocumentationComplete} 
            />
        )}

        {state.currentStage === RadarStage.ADVISE && (
            <AdvisePanel 
                advice={state.advice} 
                isLoading={state.isProcessing} 
                onContinue={handleAdviceComplete} 
            />
        )}

        {state.currentStage === RadarStage.REPORT && (
            <ReportPanel state={state} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
              <p>&copy; {new Date().getFullYear()} R.A.D.A.R. Metamethodology. All rights reserved.</p>
              <p className="text-xs mt-2">Compliance Alignment: NIST RMF • ISO/IEC 27001 • CMMC</p>
          </div>
      </footer>
    </div>
  );
};

export default App;
