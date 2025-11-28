import React, { useState } from 'react';
import { StepIndicator } from './components/StepIndicator';
import { DataInputStep } from './components/DataInputStep';
import { TransmissionStep } from './components/TransmissionStep';
import { ValidationStep } from './components/ValidationStep';
import { XBRLReport } from './types';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [standardizedReport, setStandardizedReport] = useState<XBRLReport | null>(null);

  // Step 1 Completion Handler
  const handleDataReady = (raw: string, standardized: XBRLReport) => {
    setStandardizedReport(standardized);
    setCurrentStep(1);
  };

  // Step 2 Completion Handler
  const handleTransmissionComplete = () => {
    setCurrentStep(2);
  };

  // Reset Flow
  const handleReset = () => {
    setStandardizedReport(null);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-regtech-500 rounded-lg flex items-center justify-center font-bold text-white shadow-inner">
              DRR
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">RegTech 시뮬레이터</h1>
              <p className="text-xs text-slate-400">디지털 규제 보고 (Digital Regulatory Reporting)</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            v1.0.4 Alpha
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        
        {/* Progress Tracker */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Active Step Content */}
        <div className="transition-all duration-300">
          {currentStep === 0 && (
            <DataInputStep onComplete={handleDataReady} />
          )}
          
          {currentStep === 1 && (
            <TransmissionStep onComplete={handleTransmissionComplete} />
          )}

          {currentStep === 2 && standardizedReport && (
            <ValidationStep report={standardizedReport} onReset={handleReset} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>금융 규제 기술(RegTech) 개념 증명 (PoC)</p>
          <p className="mt-1 text-xs">XBRL 데이터 표준화, API 자동 전송 및 감독 당국 유효성 검증 시뮬레이션</p>
        </div>
      </footer>
    </div>
  );
}

export default App;