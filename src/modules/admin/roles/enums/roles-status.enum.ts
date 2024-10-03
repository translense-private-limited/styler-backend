export enum rolesStatusEnum {
    LIVE = 'LIVE',          // roles will be visible for customers
    INACTIVE = 'INACTIVE',  // roles is not visible for customers
    UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION', // roles is being built or renovated
    TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED', // roles is temporarily closed
    PERMANENTLY_CLOSED = 'PERMANENTLY_CLOSED', // roles is permanently closed
    COMING_SOON = 'COMING_SOON', // roles is not yet opened but will be soon
}