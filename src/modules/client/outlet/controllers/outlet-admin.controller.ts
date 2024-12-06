import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateOutletDto } from "../dtos/outlet.dto";
import { OutletService } from "../services/outlet.service";
import { ClientExternalService } from "@modules/client/client/services/client-external.service";
import { CreateOutletWithClientDto } from "../dtos/outlet-client.dto";

@Controller('admin')
@ApiTags('Admin/Outlets')
export class OutletAdminController{
    constructor(
        private readonly outletService:OutletService,
        private readonly clientExternalService:ClientExternalService
    ){}

    @Post('outlet')
    async createOutlet (
        @Req() req:Request,
        @Body() createOutletWithClientDto:CreateOutletWithClientDto
    ){
        const {client,outlet} = createOutletWithClientDto;

        const newOutlet = await this.outletService.createOutlet(outlet);
        
    }


}