/**
 * Enum representing the various statuses of a booking for a salon or spa.
 */
export enum BookingStatusEnum {
  /**
   * The booking has been created but not yet confirmed by the salon.
   */
  PENDING = 'PENDING',

  /**
   * The booking has been confirmed by the salon and is set to proceed as scheduled.
   */
  CONFIRMED = 'CONFIRMED',

  /**
   * The customer has canceled the booking.
   */
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',

  /**
   * The salon has canceled the booking, potentially due to scheduling conflicts or other reasons.
   */
  CANCELLED_BY_SALON = 'CANCELLED_BY_SALON',

  /**
   * The booking has been rescheduled to a new date and/or time by the customer or salon.
   */
  RESCHEDULED = 'RESCHEDULED',

  /**
   * The customer did not show up for their appointment.
   */
  NO_SHOW = 'NO_SHOW',
}
