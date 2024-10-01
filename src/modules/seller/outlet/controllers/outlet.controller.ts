import { Body, Controller, Get, Post, Param, Req } from '@nestjs/common';
import { OutletService } from '../services/outlet.service';
import { OutletEntity } from '../entities/outlet.entity';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { Request } from 'express';


@Controller('outlets') // Global route
export class OutletController {
    constructor(private readonly outletService: OutletService) { }

    @Post() // POST /outlets
    async createOutlet(@Req() req: Request, @Body() createOutletDto: CreateOutletDto): Promise<OutletEntity> {
        console.log(req)
        return this.outletService.createOutlet(createOutletDto);
    }

    @Get() // GET /outlets
    async getAllOutlets(): Promise<OutletEntity[]> {
        return this.outletService.getAllOutlets();
    }
    @Get(':id')
    async getOutletById(@Param('id') id: string): Promise<OutletEntity> {
        return this.outletService.getOutletById(id);
    }


}