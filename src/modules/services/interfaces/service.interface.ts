export interface ServiceInterface {
    name: string; // e.g., Haircut, Facial
    description?: string; // Description of the service
    category: number; // Category of the service
    price: number; // Price of the service
    duration: number; // Duration in minutes (for time-based services)
    clientId: number; // Client ID associated with the service
    status?: 'available' | 'unavailable'; // Availability status of the service
  }