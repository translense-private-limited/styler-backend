import { Body, Controller, Get, Post, Param, Req, Patch, Delete } from '@nestjs/common';
import { OutletService } from '../services/outlet.service';
import { OutletEntity } from '../entities/outlet.entity';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { Request } from 'express';

@Controller('outlets') // Global route
export class OutletController {
    constructor(private readonly outletService: OutletService) {}

    @Post() // POST /outlets
    async createOutlet(
        @Req() req: Request, 
        @Body() createOutletDto: CreateOutletDto
    ): Promise<OutletEntity> {
        console.log(req);
        return this.outletService.createOutlet(createOutletDto);
    }

    @Get() // GET /outlets
    async getAllOutlets(): Promise<OutletEntity[]> {
        return this.outletService.getAllOutlets();
    }

    @Get(':id') // GET /outlets/:id
    async getOutletById(@Param('id') id: string): Promise<OutletEntity> {
        return this.outletService.getOutletById(id);
    }

    @Patch(':id') // PATCH /outlets/:id
    async updateOutlet(
        @Param('id') id: string, 
        @Body() updateOutletDto: Partial<CreateOutletDto>
    ): Promise<OutletEntity> {
        return this.outletService.updateOutlet(parseInt(id, 10), updateOutletDto);
    }

    @Delete(':id') // DELETE /outlets/:id
    async deleteOutlet(@Param('id') id: string): Promise<{ message: string }> {
        await this.outletService.deleteOutlet(parseInt(id, 10));
        return { message: `Outlet with ID ${id} has been deleted successfully.` };
    }
}
