import { ServiceExternal } from "@modules/client/services/services/service-external";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerOutletService{
    constructor(private readonly serviceExternal:ServiceExternal){}

    async getAllServicesForAnOutlet(outletId:number){
        return this.serviceExternal.getAllServicesForAnOutlet(outletId);
    }
}