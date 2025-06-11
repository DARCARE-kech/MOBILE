
/**
 * Utility functions for space reservations
 */

/**
 * Check if a reservation has expired based on preferred time
 * @param preferredTime - The preferred time of the reservation
 * @returns true if the reservation has expired, false otherwise
 */
export const isReservationExpired = (preferredTime: string | null): boolean => {
  if (!preferredTime) return true;
  
  const reservationTime = new Date(preferredTime);
  const currentTime = new Date();
  
  // Consider reservation expired if the preferred time has passed
  return reservationTime < currentTime;
};

/**
 * Check if actions (modify/cancel) should be available for a request
 * @param requestType - Type of request ('service' | 'space')
 * @param status - Current status of the request
 * @param preferredTime - Preferred time for space reservations
 * @returns true if actions should be available, false otherwise
 */
export const shouldShowRequestActions = (
  requestType: 'service' | 'space',
  status: string | null,
  preferredTime?: string | null
): boolean => {
  if (requestType === 'service') {
    // For services: hide if in_progress, completed, or cancelled
    return status !== 'in_progress' && 
           status !== 'completed' && 
           status !== 'cancelled';
  } else if (requestType === 'space') {
    // For spaces: show only if reservation hasn't expired
    return !isReservationExpired(preferredTime || null);
  }
  
  return false;
};
