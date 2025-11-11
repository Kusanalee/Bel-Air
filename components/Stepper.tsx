
import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  goToStep: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, goToStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => stepNumber < currentStep && goToStep(stepNumber)}>
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300
                    ${isCompleted ? 'bg-green-500 hover:bg-green-600' : ''}
                    ${isActive ? 'bg-brand-blue' : ''}
                    ${!isCompleted && !isActive ? 'bg-gray-300' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <p className={`mt-2 text-xs sm:text-sm text-center ${isActive ? 'font-bold text-brand-blue' : 'text-gray-500'}`}>
                  {step}
                </p>
              </div>
              {stepNumber < steps.length && (
                <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${isCompleted || isActive ? 'bg-brand-blue' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
