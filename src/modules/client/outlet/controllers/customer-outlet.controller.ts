import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "@src/utils/decorators/public.decorator";
import { CustomerOutletService } from "../services/customer-outlet.service";
@Controller('customer')
@ApiTags('Customer/Outlet')
export class CustomerOutletController{
    constructor(private readonly customerOutletSerivces:CustomerOutletService){}

    @Get('outlet/:outletId/services')
    @Public()
    async getAllServicesForAnOutlet(
        @Param('outletId',ParseIntPipe) outletId:number
    ){
        return this.customerOutletSerivces.getAllServicesForAnOutlet(outletId);
    }

}