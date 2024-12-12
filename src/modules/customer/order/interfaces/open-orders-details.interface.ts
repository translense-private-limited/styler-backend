export interface OpenOrderDetailsInterface {
    orderId: number; // Assuming orderId is a string like "Od67890"
    amountPaid: number; // Amount in string format
    services: ServiceDetailsInterface[];
    time: Date; // Time as a string (e.g., "01:00 PM")
    customerName: string; // Customer name
    customerImage: string; // Customer image URL or path
    contact: number; // Customer contact
    email: string; // Customer email
  }
  
 export interface ServiceDetailsInterface {
    serviceId: string; // Service ID
    serviceName: string; // Service name or other service details as required
    price: number; // Service price (if needed)
  }
  