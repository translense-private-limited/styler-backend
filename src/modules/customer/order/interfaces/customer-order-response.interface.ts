import { OutletStatusEnum } from "@modules/client/outlet/enums/outlet-status.enum";
import { OrderResponseInterface } from "./client-orders.interface";

export interface CustomerOrderResponseInterface extends OrderResponseInterface {
  outlet: {
    outletId: number;
    outletName: string;
    outletDescription: string;
    outletStatus: OutletStatusEnum;
    outletLatitude: string;
    outletLongitude: string;
    outletPhoneNumber: string;
    outletEmail: string;
    outletWebsite: string;
    address: {
      addressId: number;
      country: string;
      state: string;
      district: string;
      city: string;
      pincode: number;
      street: string;
      landmark: string | null;
    } | null; // Address can be null if not provided
  };
}
