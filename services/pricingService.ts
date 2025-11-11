import { QuotationState, QuoteResult, VehicleType, DestinationRate, Season, TripType } from '../types';
import { RATE_CONFIG } from '../constants/rates';

const resolveSeason = (pickupDate: string): { season: Season, maxDiscount: number } => {
  if (!pickupDate) {
    return { season: 'regular', maxDiscount: RATE_CONFIG.seasonalDiscounts.regular.maxDiscount };
  }
  
  const month = new Date(pickupDate).getMonth() + 1; // getMonth() is 0-indexed, so add 1
  const { lean, peak, regular } = RATE_CONFIG.seasonalDiscounts;

  if (lean.months?.includes(month)) {
    return { season: 'lean', maxDiscount: lean.maxDiscount };
  }
  if (peak.months?.includes(month)) {
    return { season: 'peak', maxDiscount: peak.maxDiscount };
  }
  return { season: 'regular', maxDiscount: regular.maxDiscount };
};

export const calculateQuote = (state: QuotationState): QuoteResult => {
  const breakdowns = [];
  let grandTotal = 0;
  
  const selectedVehicles = (Object.keys(state.vehicles) as VehicleType[])
    .filter(v => state.vehicles[v].quantity > 0);

  // Calculate duration
  const startDateTime = new Date(`${state.pickupDate}T${state.startTime}`);
  const endDateTime = new Date(`${state.endDate}T${state.endTime}`);
  const durationMillis = endDateTime.getTime() - startDateTime.getTime();
  const durationHours = Math.max(0, durationMillis / (1000 * 60 * 60));
  
  // Determine season
  const { season, maxDiscount } = resolveSeason(state.pickupDate);

  // Handle Custom Destination (per-km rate)
  if (state.isCustomDestination) {
      const notes = [
          `Custom trip to ${state.customDestination} (${state.estimatedKm} km round trip).`,
          "This is a preliminary estimate based on distance. Final price requires confirmation."
      ];

      for (const vehicle of selectedVehicles) {
          const { quantity } = state.vehicles[vehicle];
          const perKmRate = RATE_CONFIG.outsidePattoRates[vehicle].perKm;
          const subtotal = perKmRate * state.estimatedKm * quantity;
          grandTotal += subtotal;

          breakdowns.push({
              vehicle, quantity, baseRate: subtotal / quantity,
              subtotal, notes,
              duration: durationHours, includedHours: 0,
              extraHours: 0, extraHourCost: 0,
              days: 0, extraDayCost: 0
          });
      }
      
      const minTotalWithMaxDiscount = grandTotal * (1 - maxDiscount);

      return {
          breakdowns, grandTotal, isEstimate: false,
          season, maxDiscount, minTotalWithMaxDiscount,
          generalNotes: [
            "This is an estimated quotation only. Final confirmation, vehicle availability, and full computation (including any excluded charges) will be provided by our reservations team.",
            "Rates are exclusive of charges listed under 'Exclusions' unless otherwise specified.",
          ]
      }
  }

  // Handle PATTO-based destinations
  let destinationData: DestinationRate | undefined;
  for (const province of RATE_CONFIG.provinces) {
      const found = province.destinations.find(d => d.name === state.destination);
      if(found) {
          destinationData = found;
          break;
      }
  }

  for (const vehicle of selectedVehicles) {
    const { quantity } = state.vehicles[vehicle];
    if (quantity === 0) continue;

    let baseRate = 0;
    let includedHours = 0;
    let excessHourRate = RATE_CONFIG.belAirRates.metroManila[vehicle].excessHourRate; // Default
    const notes: string[] = [];
    
    if(destinationData) {
        baseRate = destinationData.rates[vehicle] || 0;
        includedHours = destinationData.time;
    }

    if (baseRate === 0) {
        notes.push(`Rate for ${vehicle} to this destination not available. Please call for quote.`);
    }

    // Calculate extra charges based on trip type
    let extraHourCost = 0;
    let extraDayCost = 0;
    let extraHours = 0;
    const days = Math.ceil(durationHours / 24);

    if (state.tripType === TripType.MULTI_DAY) {
        const baseHoursMultiDay = 36; // All multi-day trips have a 36-hour base
        const extraDuration = Math.max(0, durationHours - baseHoursMultiDay);
        if (extraDuration > 0) {
            const numExtraDays = Math.ceil(extraDuration / 24);
            extraDayCost = numExtraDays * RATE_CONFIG.extraDayRates[vehicle];
            notes.push(`${numExtraDays} extra day(s) calculated for trip exceeding 36 hours.`);
        }
        includedHours = baseHoursMultiDay;
    } else { // For all day-tour types
        const extraHoursUnrounded = Math.max(0, durationHours - includedHours);
        extraHours = Math.ceil(extraHoursUnrounded); 
        if (extraHours > 0) {
          extraHourCost = extraHours * excessHourRate;
        }
    }
    
    const subtotal = (baseRate + extraHourCost + extraDayCost) * quantity;
    grandTotal += subtotal;

    breakdowns.push({
      vehicle,
      quantity,
      baseRate,
      duration: durationHours,
      includedHours,
      extraHours,
      extraHourCost,
      days: state.tripType === TripType.MULTI_DAY ? days : 1,
      extraDayCost,
      subtotal,
      notes
    });
  }

  const generalNotes = [
      "This tool uses guided rates based on industry rate tables. Final rates, including any discounts, are confirmed manually by Bel-Air’s reservations team.",
      "Rates are exclusive of charges listed under 'Exclusions' unless otherwise specified.",
      "For customized itineraries, final computation may vary."
  ];

  const minTotalWithMaxDiscount = grandTotal > 0 ? Math.round(grandTotal * (1 - maxDiscount)) : 0;

  return { breakdowns, grandTotal, generalNotes, isEstimate: grandTotal === 0 && !state.isCustomDestination, season, maxDiscount, minTotalWithMaxDiscount };
};