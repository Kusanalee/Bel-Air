import React, { useState } from 'react';
import { QuotationState, TripType, VehicleType } from './types';
import Stepper from './components/Stepper';
import Step1TripDetails from './components/steps/Step1TripDetails';
import Step2Destination from './components/steps/Step2Destination';
import Step3VehicleSelection from './components/steps/Step3VehicleSelection';
import Step4QuotationSummary from './components/steps/Step4QuotationSummary';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quotationState, setQuotationState] = useState<QuotationState>({
    tripType: TripType.OUT_OF_TOWN_DAY,
    pickupDate: '',
    startTime: '08:00',
    endDate: '',
    endTime: '18:00',
    destination: '',
    isCustomDestination: false,
    customDestination: '',
    estimatedKm: 0,
    vehicles: {
      [VehicleType.BUS]: { quantity: 0 },
      [VehicleType.VAN]: { quantity: 0 },
    },
    tripTypeSwitched: false,
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const updateQuotationState = (updates: Partial<QuotationState>) => {
    setQuotationState(prevState => ({ ...prevState, ...updates }));
  };
  
  const steps = ['Trip Details', 'Destination', 'Vehicles', 'Quotation'];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1TripDetails state={quotationState} setState={updateQuotationState} nextStep={nextStep} />;
      case 2:
        return <Step2Destination state={quotationState} setState={updateQuotationState} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3VehicleSelection state={quotationState} setState={updateQuotationState} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Step4QuotationSummary state={quotationState} prevStep={prevStep} />;
      default:
        return <Step1TripDetails state={quotationState} setState={updateQuotationState} nextStep={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-5xl text-center mb-8">
         <div className="flex justify-center items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5 6.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm-15 0c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm15 11h-15v-1.5c0-2.33 4.67-3.5 7.5-3.5s7.5 1.17 7.5 3.5v1.5zm-11.25-5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm5 0c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm-2.5-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zM22 11.5v3.5h-2v-3.5c0-1.25-.5-2.45-1.37-3.37l-1.5-1.55c-.24-.24-.58-.38-.93-.38h-8.4c-.35 0-.69.14-.93.38l-1.5 1.55c-.87.92-1.37 2.12-1.37 3.37v3.5h-2v-3.5c0-1.6.63-3.13 1.76-4.24l1.5-1.55c.6-.6 1.4-1.01 2.24-1.01h8.4c.84 0 1.64.41 2.24 1.01l1.5 1.55c1.13 1.11 1.76 2.64 1.76 4.24z"/>
            </svg>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-brand-blue">Bel-Air Bus Charter</h1>
<span className="bg-gray-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                Beta
              </span>
            </div>
        </div>
        <p className="text-lg text-gray-600 mt-2">Instant Quotation System</p>
        <p className="text-sm text-gray-500 mt-1">This tool provides an estimate only. Final booking is confirmed by our team.</p>
      </header>
      
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        <Stepper steps={steps} currentStep={currentStep} goToStep={goToStep} />
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>

      <footer className="w-full max-w-5xl text-center mt-8 text-sm text-gray-500">
        <p>This is an estimated quotation only. Final confirmation, availability, and payment will be handled by our reservations team.</p>
        <p>&copy; {new Date().getFullYear()} Bel-Air Bus Charter Corporation. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;