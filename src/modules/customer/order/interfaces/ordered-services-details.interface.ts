export interface OrderedServicesDetailsInterface {
    serviceId: string;
    startTime: Date;
    endTime?: Date;
    quantity: number;
    outletId: number;
    notes?: string;
  }
  