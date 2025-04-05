export interface ReviewInterface {
  id: number;
  customerId: number;
  serviceId: string;
  rating: number;
  review?: string;
}
