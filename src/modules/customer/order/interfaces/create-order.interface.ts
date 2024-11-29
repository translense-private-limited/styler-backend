import { ServicesDto } from "../dtos/services.dto";

export interface CreateOrderInterface {
  services: ServicesDto[];     
  customerId: number;           
  paymentId: string;            
}
