export enum OutletStatusEnum {
  LIVE = 'LIVE', // Outlet will be visible for customers
  INACTIVE = 'INACTIVE', // Outlet is not visible for customers
  ONBOARDING = 'ONBOARDING', // Outlet is in process of being onboarded
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED', // Outlet is temporarily closed
  PERMANENTLY_CLOSED = 'PERMANENTLY_CLOSED', // Outlet is permanently closed
  COMING_SOON = 'COMING_SOON', // Outlet is not yet opened but will be soon
}
