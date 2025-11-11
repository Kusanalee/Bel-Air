import React, { useMemo } from 'react';
import { QuotationState, TripType, VehicleType } from '../../types';
import { calculateQuote } from '../../services/pricingService';
import { RATE_CONFIG } from '../../constants/rates';

interface Props {
  state: QuotationState;
  prevStep: () => void;
}

const Step4QuotationSummary: React.FC<Props> = ({ state, prevStep }) => {
  const quoteResult = useMemo(() => calculateQuote(state), [state]);
  const { contactInfo, finePrint, paymentTerms, belAirRates } = RATE_CONFIG;
  
  const handlePrint = () => window.print();

  const renderSeasonalMessage = () => {
    if (quoteResult.isEstimate || quoteResult.grandTotal === 0) return null;
    
    switch (quoteResult.season) {
      case 'lean':
        return (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            Based on the current lean season, management may grant up to <strong>{(quoteResult.maxDiscount * 100)}% discount</strong> depending on availability and negotiation. This means your final rate may be as low as <strong>₱{quoteResult.minTotalWithMaxDiscount.toLocaleString()}</strong>. Exact amount will be confirmed by our reservations team.
          </div>
        );
      case 'peak':
         return (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            This is a peak season period. Limited discounts may be available, up to <strong>{(quoteResult.maxDiscount * 100)}%</strong> depending on availability and management approval. The amount shown is based on our standard guided rate; final rate will be confirmed by our reservations team.
          </div>
        );
      case 'regular':
        return (
           <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
            Rates are based on our standard guided rate. Any discount is subject to management approval.
           </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Quotation Summary</h2>
        <p className="text-gray-500">Here is your estimated quotation.</p>
      </div>

      <div id="quotation-details" className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        {/* Trip Details Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Trip Type:</strong> {state.tripType}</div>
            <div><strong>Destination:</strong> {state.isCustomDestination ? state.customDestination : state.destination}</div>
            <div><strong>Pickup:</strong> {new Date(state.pickupDate + 'T' + state.startTime).toLocaleString()}</div>
            <div><strong>Return:</strong> {new Date(state.endDate + 'T' + state.endTime).toLocaleString()}</div>
        </div>
        <hr/>
        
        {/* Breakdown */}
        {quoteResult.breakdowns.map((item, index) => (
          <div key={index} className="pb-2">
            <h4 className="font-bold text-lg text-brand-blue capitalize">{item.vehicle} (x{item.quantity})</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                <span>Base Rate:</span><span className="text-right">₱{item.baseRate.toLocaleString()}</span>
                {item.extraHourCost > 0 && <>
                    <span>Extra Hours ({item.extraHours}h):</span><span className="text-right">₱{item.extraHourCost.toLocaleString()}</span>
                </>}
                 {item.extraDayCost > 0 && <>
                    <span>Extra Days ({item.days > 1 ? item.days -1 : 1 }d):</span><span className="text-right">₱{item.extraDayCost.toLocaleString()}</span>
                </>}
                 <span className="font-semibold">Subtotal:</span><span className="text-right font-semibold">₱{item.subtotal.toLocaleString()}</span>
            </div>
          </div>
        ))}
        
        {/* Grand Total */}
         <hr/>
         <div className="text-right">
            <p className="text-gray-600">Standard Estimated Amount</p>
            {quoteResult.isEstimate ? 
                <p className="text-3xl font-bold text-brand-blue">Contact for Quote</p>
                :
                <p className="text-3xl font-bold text-brand-blue">₱{quoteResult.grandTotal.toLocaleString()}</p>
            }
            {renderSeasonalMessage()}
         </div>

         {/* General Notes */}
         <div className="pt-4 text-xs text-gray-500 space-y-1">
             {quoteResult.generalNotes.map((note,i) => <p key={i}>* {note}</p>)}
             {state.tripTypeSwitched && (
                <p className="font-semibold text-gray-600">* Trip type auto-updated to Out-of-Town Day Tour based on destination.</p>
             )}
         </div>
      </div>

       {/* Fine Print Section */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="font-bold text-gray-800 mb-2">Fine Print</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-green-700">Inclusions:</h4>
            <ul className="list-disc list-inside text-gray-600">
              {finePrint.inclusions.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-700">Exclusions (charged separately):</h4>
            <ul className="list-disc list-inside text-gray-600">
              {finePrint.exclusions.map((item, i) => (
                <li key={i}>
                  {item.text}
                  {item.dynamic === 'excessHours' && (
                     <span className="text-xs block pl-4">
                        (Bus: ₱{belAirRates.metroManila[VehicleType.BUS].excessHourRate.toLocaleString()}/hr, 
                        Van: ₱{belAirRates.metroManila[VehicleType.VAN].excessHourRate.toLocaleString()}/hr)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-bold text-gray-800 mb-2">Payment Terms</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
             {paymentTerms.map((term, i) => <li key={i}>{term}</li>)}
          </ul>
      </div>

      {/* Next Steps */}
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg text-center">
        <h3 className="font-bold text-yellow-800">Next Steps: Confirm Your Booking</h3>
        <p className="text-sm text-yellow-700 mt-2">To confirm this booking and arrange payment, please contact our reservations officer:</p>
        <div className="mt-4 flex flex-wrap justify-center items-center gap-3">
            {contactInfo.phone.map(phone => (
                 <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex-grow sm:flex-grow-0">Call: {phone}</a>
            ))}
            <a href={`mailto:${contactInfo.email}`} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex-grow sm:flex-grow-0">Email: {contactInfo.email}</a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
        <button
          onClick={prevStep}
          className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300 w-full sm:w-auto flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          onClick={handlePrint}
          className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-300 w-full sm:w-auto"
        >
          Download / Print Quotation
        </button>
      </div>
    </div>
  );
};

export default Step4QuotationSummary;