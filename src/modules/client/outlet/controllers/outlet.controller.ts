import { Body, Controller, Get, Post, Param, Req, Query } from '@nestjs/common';
import { OutletService } from '../services/outlet.service';
import { OutletEntity } from '../entities/outlet.entity';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OutletInterface } from '../interfaces/outlet.interface';
import { OutletFilterDto } from '../dtos/outlet-filter.dto';

@Controller('client/outlets') // Global route
@ApiTags('Outlet')
export class OutletController {
  constructor(private readonly outletService: OutletService) {}

  @Post() // POST /outlets
  async createOutlet(
    @Req() req: Request,
    @Body() createOutletDto: CreateOutletDto,
  ): Promise<OutletEntity> {
    return this.outletService.createOutlet(createOutletDto);
  }

  @Get() // GET /outlets
  async getAllOutlets(
    @Query() filterDto: OutletFilterDto,
  ): Promise<OutletInterface[]> {
    return this.outletService.getAllOutlets(filterDto); 
  }
  
  @Get(':outletId')
  @ApiBearerAuth('jwt')
  async getOutletById(
    @Param('outletId') outletId: string,
  ): Promise<OutletEntity> {
    return this.outletService.getOutletByIdOrThrow(parseInt(outletId));
  }
}
