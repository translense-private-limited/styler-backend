export enum OutletStatusEnum {
  LIVE = 'LIVE', // Outlet will be visible for customers
  INACTIVE = 'INACTIVE', // Outlet is not visible for customers
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION', // Outlet is being built or renovated
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED', // Outlet is temporarily closed
  PERMANENTLY_CLOSED = 'PERMANENTLY_CLOSED', // Outlet is permanently closed
  COMING_SOON = 'COMING_SOON', // Outlet is not yet opened but will be soon
}
