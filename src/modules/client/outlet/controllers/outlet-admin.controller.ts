import { Body, Controller, Post, Req } from "@nestjs/common";
import { OutletRepository } from "../repositories/outlet.repository";
import { ApiTags } from "@nestjs/swagger";
import { CreateOutletDto } from "../dtos/outlet.dto";
import { OutletService } from "../services/outlet.service";

@Controller('admin')
@ApiTags('Admin/Outlets')
export class OutletAdminController{
    constructor(
        private readonly outletRepository:OutletRepository,
        private readonly outletService:OutletService
    ){}

    @Post('outlet')
    async createOutlet (
        @Req() req:Request,
        @Body() createOutletDto:CreateOutletDto
    ){
        return await this.outletService.createOutlet(createOutletDto);
    }


}