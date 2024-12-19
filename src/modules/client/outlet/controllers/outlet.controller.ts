import { Body, Controller, Get, Post, Param, Req } from '@nestjs/common';
import { OutletService } from '../services/outlet.service';
import { OutletEntity } from '../entities/outlet.entity';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OutletInterface } from '../interfaces/outlet.interface';

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
  async getAllOutlets(): Promise<OutletInterface[]> {
    return this.outletService.getAllOutlets();
  }
  @Get(':outletId')
  @ApiBearerAuth('jwt')
  async getOutletById(
    @Param('outletId') outletId: string,
  ): Promise<OutletEntity> {
    return this.outletService.getOutletByIdOrThrow(parseInt(outletId));
  }
}
