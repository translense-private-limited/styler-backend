import { Injectable } from "@nestjs/common";
import { OutletService } from "./outlet.service";
import { OutletEntity } from "../entities/outlet.entity";

@Injectable()
export class OutletExternalService {
    constructor(private outletService: OutletService){}

    async getOutletById(outletId: number ): Promise<OutletEntity>{
        const outlet = await this.outletService.getOutletById(outletId)
        return outlet
    }
}