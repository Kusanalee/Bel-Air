import React, { useState } from 'react';
import { QuotationState, VehicleType } from '../../types';
import { RATE_CONFIG } from '../../constants/rates';
import { checkAvailability } from '../../services/availabilityService';

interface Props {
  state: QuotationState;
  setState: (updates: Partial<QuotationState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const VehicleCard: React.FC<{
  type: VehicleType,
  name: string,
  state: QuotationState,
  setState: (updates: Partial<QuotationState>) => void,
  availabilityError: string,
}> = ({ type, name, state, setState, availabilityError }) => {
  const details = RATE_CONFIG.vehicleDetails[type];

  const handleQuantityChange = (delta: number) => {
    const currentQuantity = state.vehicles[type].quantity;
    const newQuantity = Math.max(0, currentQuantity + delta);
    setState({
      vehicles: {
        ...state.vehicles,
        [type]: { quantity: newQuantity },
      },
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div>
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{details.capacity}</p>
        {availabilityError && <p className="text-red-500 text-xs mt-1">{availabilityError}</p>}
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={() => handleQuantityChange(-1)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-lg">-</button>
        <span className="text-xl font-bold w-12 text-center">{state.vehicles[type].quantity}</span>
        <button onClick={() => handleQuantityChange(1)} className="w-8 h-8 rounded-full bg-brand-blue text-white hover:bg-blue-800 font-bold text-lg">+</button>
      </div>
    </div>
  );
};

const Step3VehicleSelection: React.FC<Props> = ({ state, setState, nextStep, prevStep }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const validateAndCheckAvailability = () => {
    const newErrors: { [key: string]: string } = {};
    let hasVehicle = false;
    
    const vehicleTypes = Object.keys(state.vehicles) as VehicleType[];
    
    for (const type of vehicleTypes) {
      const quantity = state.vehicles[type].quantity;
      if (quantity > 0) {
        hasVehicle = true;
        const isAvailable = checkAvailability(type, quantity, state.pickupDate, state.startTime, state.endDate, state.endTime);
        if (!isAvailable) {
          newErrors[type] = `Requested number of ${type}s is not available for this schedule. Please adjust your quantity/date or contact our reservations team.`;
        }
      }
    }

    if (!hasVehicle) {
      newErrors.general = 'Please select at least one vehicle.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateAndCheckAvailability()) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Vehicle Selection</h2>
      
      <div className="space-y-4">
        <VehicleCard type={VehicleType.BUS} name="Bus" state={state} setState={setState} availabilityError={errors.bus}/>
        <VehicleCard type={VehicleType.VAN} name="Van" state={state} setState={setState} availabilityError={errors.van}/>
      </div>
      
      {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-300 flex items-center"
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Step3VehicleSelection;