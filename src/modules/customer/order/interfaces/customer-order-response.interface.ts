import { AddressDto } from "@src/utils/dtos/address.dto";
import { OrderResponseInterface } from "./client-orders.interface";

export interface CustomerOrderResponseInterface extends OrderResponseInterface {
  outlet: {
    outletId: number;
    outletName: string;
    outletDescription: string;
    outletLatitude: string;
    outletLongitude: string;
    outletPhoneNumber: string;
    outletEmail: string;
    outletWebsite: string;
    address: AddressDto| null; // Address can be null if not provided
  };
}
