export class PostOrderResponseDto {
    orderItems: {
      serviceId: string;
      quantity: number;
      notes?: string;
    }[];
    bookingSlot: {
        startTime: Date;
        endTime: Date;
      };
    orderId:number;
    outletId: number;
    paymentId: string;
    
  }
  