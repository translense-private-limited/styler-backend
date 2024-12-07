import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OutletService } from "../services/outlet.service";
import { CreateOutletWithClientDto } from "../dtos/outlet-client.dto";
import { DeleteOutletDto } from "../dtos/delete-outlet.dto";
import { OutletStatusEnum } from "../enums/outlet-status.enum";
import { OutletEntity } from "../entities/outlet.entity";
import { CreateOutletDto } from "../dtos/outlet.dto";
import { OutletAdminService } from "../services/outlet-admin.service";
import { RegisterClientDto } from "@modules/client/client/dtos/register-client.dto";

@ApiTags('Admin/Outlets')
@Controller('admin')
export class OutletAdminController{
    constructor(
        private readonly outletService:OutletService,
        private readonly outletAdminService:OutletAdminService
    ){}

    @Post('outlet')
    async createOutletWithClient(
      @Body() createOutletWithClientDto: CreateOutletWithClientDto,
    ) {
      return await this.outletAdminService.createOutletWithClient(createOutletWithClientDto);
    }

    @Get('outlets')
    async getAllOutlets(){
        return this.outletAdminService.getAllOutlets();
    }

    @Patch('outlet/:outletId')
    async updateOutlet(
        @Param('outletId') outletId:number,
        @Body() updateOutletDto:Partial<CreateOutletDto>
    ){  
        console.log(updateOutletDto)
        return await this.outletAdminService.updateOutletByIdOrThrow(outletId,updateOutletDto)
    }

    @Patch('status/outlet/:outletId')
    async updateOutletStatus(
        @Param('outletId') outletId: number, 
        @Body('status') status: OutletStatusEnum,
    ): Promise<OutletEntity> {
        const outlet = await this.outletAdminService.updateOutletStatus(outletId, status);
        return outlet;
    }


    @Delete('outlet/:outletId')
    async deleteOutlet(
        @Param('outletId') outletId:number,
        @Body() deleteOutletDto:DeleteOutletDto
    ){
        return await this.outletAdminService.deleteOutletByIdOrThrow(outletId,deleteOutletDto)
    }

    @Post('add-client/outlet/:outletId')
    async addClientToAnExistingOutlet(
        @Param('outletId') outletId:number, 
        @Body() registerClientDto:RegisterClientDto
    ){
        return await this.outletAdminService.addClientToAnExistingOutlet(outletId,registerClientDto)
    }

}