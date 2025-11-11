export enum TripType {
  OUT_OF_TOWN_DAY = 'Out-of-Town Day Tour',
  MULTI_DAY = 'Multi-Day / Overnight',
  CITY_TRANSFER = 'City Transfer (One Way)',
  CITY_TOUR = 'City Tour (5 hours)',
  WHOLE_DAY_METRO = 'Whole Day (Metro Manila)',
}

export enum VehicleType {
  BUS = 'bus',
  VAN = 'van',
}

export interface VehicleSelection {
  quantity: number;
}

export interface QuotationState {
  tripType: TripType;
  pickupDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  destination: string;
  isCustomDestination: boolean;
  customDestination: string;
  estimatedKm: number;
  vehicles: {
    [key in VehicleType]: VehicleSelection;
  };
  tripTypeSwitched?: boolean;
}

export interface DestinationRate {
  name: string;
  kms?: number;
  time: number;
  rates: {
    [key in VehicleType]?: number;
  };
}

export interface ProvinceData {
  name: string;
  destinations: DestinationRate[];
}

export interface VehicleConfig {
  capacity: string;
  baseRate?: number;
  baseHours?: number;
  excessHourRate?: number;
}

export interface BelAirRates {
  metroManila: {
    [key in VehicleType]: Omit<VehicleConfig, 'capacity'> & { baseRate: number; baseHours: number; excessHourRate: number };
  };
}

interface SeasonConfig {
  months?: number[]; // Months are 1-12
  maxDiscount: number;
}

export interface RateConfig {
  provinces: ProvinceData[];
  belAirRates: BelAirRates;
  outsidePattoRates: {
    [key in VehicleType]: { perKm: number };
  };
  extraDayRates: {
    [key in VehicleType]: number;
  };
  vehicleDetails: {
    [key in VehicleType]: Pick<VehicleConfig, 'capacity'>;
  }
  vehicleInventory: {
    [key in VehicleType]: number;
  };
  sampleBookings: {
    vehicleType: VehicleType;
    quantity: number;
    startDate: string;
    endDate: string;
  }[];
  contactInfo: {
    phone: string[];
    email: string;
    companyEmail: string;
  };
  finePrint: {
    inclusions: string[];
    exclusions: { text: string; dynamic?: 'excessHours' }[];
  };
  paymentTerms: string[];
  seasonalDiscounts: {
    lean: SeasonConfig;
    peak: SeasonConfig;
    regular: SeasonConfig;
  };
}

export interface QuoteBreakdown {
  vehicle: VehicleType;
  quantity: number;
  baseRate: number;
  duration: number;
  includedHours: number;
  extraHours: number;
  extraHourCost: number;
  days: number;
  extraDayCost: number;
  subtotal: number;
  notes: string[];
}

export type Season = 'lean' | 'peak' | 'regular';

export interface QuoteResult {
  breakdowns: QuoteBreakdown[];
  grandTotal: number;
  generalNotes: string[];
  isEstimate: boolean;
  season: Season;
  maxDiscount: number;
  minTotalWithMaxDiscount: number;
}
