import React from 'react';
import { Database, Send, ShieldCheck } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 0, name: '데이터 표준화', icon: Database },
  { id: 1, name: '데이터 전송', icon: Send },
  { id: 2, name: '유효성 검증', icon: ShieldCheck },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Connector Line */}
              {index > 0 && (
                <div 
                  className={`h-1 w-16 sm:w-24 md:w-32 transition-colors duration-500 ${
                    index <= currentStep ? 'bg-regtech-600' : 'bg-gray-200'
                  }`}
                />
              )}
              
              {/* Step Circle */}
              <div className="relative flex flex-col items-center group">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                    isActive || isCompleted 
                      ? 'bg-regtech-600 border-regtech-600 text-white shadow-lg scale-110' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span 
                  className={`absolute top-14 text-xs sm:text-sm font-semibold whitespace-nowrap ${
                    isActive || isCompleted ? 'text-regtech-800' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};