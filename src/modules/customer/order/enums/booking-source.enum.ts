export enum AppointmentSourceEnum {
  CUSTOMER = 'CUSTOMER', // Booked by the customer via the app or website
  WALK_IN = 'WALK_IN', // Created manually by the client for a walk-in customer
  CALL = 'CALL', // Created manually for a customer who booked via phone call
  ADMIN = 'ADMIN', // Created by an admin for special cases
}
