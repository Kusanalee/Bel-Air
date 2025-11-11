import React, { useState, useMemo, useEffect } from 'react';
import { QuotationState, TripType } from '../../types';
import { OUT_OF_TOWN_DAY_TOUR_DESTINATIONS, MULTI_DAY_OVERNIGHT_DESTINATIONS } from '../../constants/rates';
import { isMetroLocked, isMetroDestination } from '../../utils/tripUtils';
import Modal from '../Modal';

interface Props {
  state: QuotationState;
  setState: (updates: Partial<QuotationState>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const Step2Destination: React.FC<Props> = ({ state, setState, nextStep, prevStep }) => {
  const [error, setError] = useState('');
  const { tripType } = state;

  const [isGuardrailModalOpen, setGuardrailModalOpen] = useState(false);
  const [nonMetroAttempt, setNonMetroAttempt] = useState('');
  const [localDestination, setLocalDestination] = useState('');

  const destinationOptions = useMemo(() => {
    return tripType === TripType.OUT_OF_TOWN_DAY ? OUT_OF_TOWN_DAY_TOUR_DESTINATIONS :
           tripType === TripType.MULTI_DAY ? MULTI_DAY_OVERNIGHT_DESTINATIONS : [];
  }, [tripType]);

  const metroManilaDestination = useMemo(() => {
    // Fix: Use TripType enum members directly for consistency and to avoid hardcoded strings.
    switch (tripType) {
      case TripType.CITY_TRANSFER: return TripType.CITY_TRANSFER;
      case TripType.CITY_TOUR: return TripType.CITY_TOUR;
      case TripType.WHOLE_DAY_METRO: return TripType.WHOLE_DAY_METRO;
      default: return null;
    }
  }, [tripType]);

  useEffect(() => {
    if (metroManilaDestination) {
      setState({ destination: metroManilaDestination, isCustomDestination: false, customDestination: '' });
      setLocalDestination(metroManilaDestination);
    } else {
      setLocalDestination(state.isCustomDestination ? state.customDestination : state.destination);
    }
  }, [tripType, metroManilaDestination, setState, state.destination, state.isCustomDestination, state.customDestination]);

  const handleDestinationChange = (value: string) => {
    setLocalDestination(value);
    if (isMetroLocked(tripType) && value.trim() && !isMetroDestination(value)) {
      setNonMetroAttempt(value);
      setGuardrailModalOpen(true);
    } else {
      if (isMetroLocked(tripType)) {
        setState({ destination: metroManilaDestination || value });
      }
    }
  };
  
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setState({ isCustomDestination: true, destination: '', customDestination: '', estimatedKm: 0 });
    } else {
      setState({ isCustomDestination: false, destination: value });
    }
  };

  const handleSwitchTripType = () => {
    const attemptedDestUpper = nonMetroAttempt.toUpperCase();
    const matchedPattoDest = OUT_OF_TOWN_DAY_TOUR_DESTINATIONS.find(d => d.includes(attemptedDestUpper));
    
    const updates: Partial<QuotationState> = {
      tripType: TripType.OUT_OF_TOWN_DAY,
      tripTypeSwitched: true,
    };

    if (matchedPattoDest) {
      updates.destination = matchedPattoDest;
      updates.isCustomDestination = false;
      updates.customDestination = '';
    } else {
      updates.destination = '';
      updates.isCustomDestination = true;
      updates.customDestination = nonMetroAttempt;
    }
    setState(updates);
    setGuardrailModalOpen(false);
  };

  const handleCancelSwitch = () => {
    setLocalDestination(metroManilaDestination || '');
    setGuardrailModalOpen(false);
  };
  
  const validate = () => {
    if (!metroManilaDestination) {
        if (!state.destination && !state.isCustomDestination) {
            setError('Please select a destination.'); return false;
        }
        if (state.isCustomDestination) {
            if (!state.customDestination.trim()) {
                setError('Please enter your custom destination.'); return false;
            }
            if (state.estimatedKm <= 0) {
                setError('Please enter an estimated round trip distance greater than 0.'); return false;
            }
        }
    }
    setError('');
    return true;
  }

  const handleNext = () => {
    if (validate()) nextStep();
  }

  const renderDestinationSelector = () => {
    if (metroManilaDestination) {
      return (
        <div>
          <label htmlFor="metroDestination" className="block text-sm font-medium text-gray-700">Destination</label>
          <input
            id="metroDestination"
            type="text"
            value={localDestination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Destination is auto-set to <strong>Metro Manila</strong> for this trip type per our rate table. For provincial trips, choose <strong>Out-of-Town Day Tour</strong> or <strong>Multi-Day / Overnight</strong>.
          </p>
        </div>
      );
    }

    return (
      <>
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
          <select id="destination" value={state.isCustomDestination ? 'custom' : state.destination} onChange={handleDropdownChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md">
            <option value="" disabled>Select a destination</option>
            {destinationOptions.map(dest => <option key={dest} value={dest}>{dest}</option>)}
            <option value="custom">Other destination (enter below)</option>
          </select>
          {error && !state.isCustomDestination && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        {state.isCustomDestination && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
                <label htmlFor="customDestination" className="block text-sm font-medium text-gray-700">Custom Destination (City/Municipality)</label>
                <input type="text" id="customDestination" value={state.customDestination} onChange={(e) => setState({ customDestination: e.target.value })} placeholder="e.g., Baguio City" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
            </div>
             <div>
                <label htmlFor="estimatedKm" className="block text-sm font-medium text-gray-700">Estimated Round Trip (km)</label>
                <input type="number" id="estimatedKm" value={state.estimatedKm > 0 ? state.estimatedKm : ''} onChange={(e) => setState({ estimatedKm: parseInt(e.target.value, 10) || 0 })} placeholder="e.g., 500" min="1" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
            </div>
            {error && state.isCustomDestination && <p className="text-red-500 text-xs mt-1 md:col-span-2">{error}</p>}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
       <Modal
        isOpen={isGuardrailModalOpen}
        onClose={handleCancelSwitch}
        onConfirm={handleSwitchTripType}
        title="Destination outside Metro Manila"
        message="That destination is outside Metro Manila. Switch trip type to Out-of-Town Day Tour?"
        confirmLabel="Switch"
        cancelLabel="Cancel"
      />
      <h2 className="text-2xl font-bold text-gray-800">Destination Selection</h2>
      {renderDestinationSelector()}
      <div className="flex justify-between mt-8">
        <button onClick={prevStep} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          Back
        </button>
        <button onClick={handleNext} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 flex items-center">
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Step2Destination;