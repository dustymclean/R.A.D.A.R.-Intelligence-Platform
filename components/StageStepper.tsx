import React from 'react';
import { RadarStage } from '../types';

interface StageStepperProps {
  currentStage: RadarStage;
}

const steps = [
  { id: RadarStage.RETRIEVE, label: 'Retrieve', letter: 'R' },
  { id: RadarStage.ANALYZE, label: 'Analyze', letter: 'A' },
  { id: RadarStage.DOCUMENT, label: 'Document', letter: 'D' },
  { id: RadarStage.ADVISE, label: 'Advise', letter: 'A' },
  { id: RadarStage.REPORT, label: 'Report', letter: 'R' },
];

export const StageStepper: React.FC<StageStepperProps> = ({ currentStage }) => {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center relative">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-0 transform -translate-y-1/2"></div>
          
          {/* Active Progress Bar */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-cyan-500 -z-0 transform -translate-y-1/2 transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStage / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step) => {
            const isActive = currentStage >= step.id;
            const isCurrent = currentStage === step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center group">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300
                    ${isActive 
                      ? 'bg-cyan-900 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                    }
                    ${isCurrent ? 'scale-110 ring-2 ring-cyan-500 ring-offset-2 ring-offset-slate-900' : ''}
                  `}
                >
                  {step.letter}
                </div>
                <span 
                  className={`mt-2 text-xs font-medium tracking-wider uppercase transition-colors duration-300
                    ${isActive ? 'text-cyan-400' : 'text-slate-600'}
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
