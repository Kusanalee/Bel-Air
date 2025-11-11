
import React, { useState } from 'react';
import { QuotationState, TripType } from '../../types';

interface Props {
  state: QuotationState;
  setState: (updates: Partial<QuotationState>) => void;
  nextStep: () => void;
}

const Step1TripDetails: React.FC<Props> = ({ state, setState, nextStep }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!state.pickupDate) newErrors.pickupDate = 'Pickup date is required.';
    if (!state.startTime) newErrors.startTime = 'Start time is required.';

    const isMultiDay = state.tripType === TripType.MULTI_DAY;
    if (isMultiDay) {
        if (!state.endDate) newErrors.endDate = 'End date is required.';
        else if (new Date(state.endDate) < new Date(state.pickupDate)) newErrors.endDate = 'End date cannot be before pickup date.';
    }
    
    if (!isMultiDay) {
        if (!state.endTime) newErrors.endTime = 'End time is required.';
        else {
             const startDateTime = new Date(`${state.pickupDate}T${state.startTime}`);
             const endDateTime = new Date(`${state.pickupDate}T${state.endTime}`);
             if(endDateTime <= startDateTime) newErrors.endTime = 'End time must be after start time.';
        }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      if (state.tripType !== TripType.MULTI_DAY) {
        setState({ endDate: state.pickupDate });
      }
      nextStep();
    }
  };
  
  const isMultiDay = state.tripType === TripType.MULTI_DAY;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Trip Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="tripType" className="block text-sm font-medium text-gray-700">Trip Type</label>
          <select
            id="tripType"
            value={state.tripType}
            onChange={(e) => setState({ tripType: e.target.value as TripType })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
          >
            {Object.values(TripType).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">Pickup Date</label>
          <input
            type="date"
            id="pickupDate"
            value={state.pickupDate}
            onChange={(e) => setState({ pickupDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
          />
          {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            id="startTime"
            value={state.startTime}
            onChange={(e) => setState({ startTime: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
          />
          {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="endDate" className={`block text-sm font-medium ${isMultiDay ? 'text-gray-700' : 'text-gray-400'}`}>End Date</label>
          <input
            type="date"
            id="endDate"
            value={isMultiDay ? state.endDate : state.pickupDate}
            onChange={(e) => setState({ endDate: e.target.value })}
            min={state.pickupDate}
            disabled={!isMultiDay}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100"
          />
           {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            id="endTime"
            value={state.endTime}
            onChange={(e) => setState({ endTime: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
          />
           {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
        </div>
      </div>
      <div className="flex justify-end mt-8">
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

export default Step1TripDetails;
