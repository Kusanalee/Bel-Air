
import { VehicleType } from '../types';
import { RATE_CONFIG } from '../constants/rates';

export const checkAvailability = (
  vehicleType: VehicleType,
  quantity: number,
  pickupDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): boolean => {
  if (!pickupDate || !startTime || !endDate || !endTime) return true; // Can't check if date is not set

  const totalInventory = RATE_CONFIG.vehicleInventory[vehicleType];
  const requestedStart = new Date(`${pickupDate}T${startTime}`).getTime();
  const requestedEnd = new Date(`${endDate}T${endTime}`).getTime();

  const overlappingBookings = RATE_CONFIG.sampleBookings.filter(booking => {
    if (booking.vehicleType !== vehicleType) return false;
    
    const bookingStart = new Date(booking.startDate).getTime();
    const bookingEnd = new Date(booking.endDate).getTime();

    // Check for overlap
    return (requestedStart < bookingEnd) && (requestedEnd > bookingStart);
  });
  
  const bookedQuantity = overlappingBookings.reduce((sum, booking) => sum + booking.quantity, 0);

  const availableQuantity = totalInventory - bookedQuantity;

  return quantity <= availableQuantity;
};
