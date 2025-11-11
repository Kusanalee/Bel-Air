import { TripType } from '../types';

export const METRO_LOCKED_TRIP_TYPES = new Set<TripType>([
  TripType.CITY_TRANSFER,
  TripType.CITY_TOUR,
  TripType.WHOLE_DAY_METRO,
]);

export function isMetroLocked(tripType: TripType): boolean {
  return METRO_LOCKED_TRIP_TYPES.has(tripType);
}

const METRO_CITIES_KEYWORDS = new Set([
  'MANILA', 'MAKATI', 'TAGUIG', 'PASIG', 'PASAY', 'QUEZON CITY', 'MANDALUYONG',
  'SAN JUAN', 'MUNTINLUPA', 'PARAÑAQUE', 'LAS PIÑAS', 'MARIKINA', 'VALENZUELA',
  'CALOOCAN', 'MALABON', 'NAVOTAS', 'METRO MANILA', 'TRANSFER', 'CITY TOUR'
]);

export function isMetroDestination(label: string): boolean {
  if (!label) return false;
  const upperLabel = label.trim().toUpperCase();

  for (const city of METRO_CITIES_KEYWORDS) {
    if (upperLabel.includes(city)) {
      return true;
    }
  }
  return false;
}
