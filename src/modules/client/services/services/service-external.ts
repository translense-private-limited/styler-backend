import { Injectable } from "@nestjs/common";
import { ServiceService } from "./service.service";

@Injectable()
export class ServiceExternal{
    constructor(private readonly serviceService:ServiceService){}

    async getAllServicesForAnOutlet(outletId:number){
        return this.serviceService.getAllServicesByOutletId(outletId);
    }
}