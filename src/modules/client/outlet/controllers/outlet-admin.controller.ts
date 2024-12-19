import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OutletService } from '../services/outlet.service';
import { CreateOutletWithClientDto } from '../dtos/outlet-client.dto';
import { DeleteOutletDto } from '../dtos/delete-outlet.dto';
import { OutletStatusEnum } from '../enums/outlet-status.enum';
import { OutletEntity } from '../entities/outlet.entity';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletAdminService } from '../services/outlet-admin.service';
import { RegisterClientDto } from '@modules/client/client/dtos/register-client.dto';
import { ClientEntity } from '@modules/client/client/entities/client.entity';
import { AddressEntity } from '@src/utils/entities/address.entity';

import { CityInterface, CountryInterface, StateInterface } from '../address.interface';
import { OutletInterface } from '../interfaces/outlet.interface';

@ApiTags('Admin/Outlets')
@Controller('admin')
export class OutletAdminController {
  constructor(
    private readonly outletService: OutletService,
    private readonly outletAdminService: OutletAdminService,
  ) {}

  @ApiOperation({
    summary: 'creates new outlet',
  })
  @Post('outlet')
  async createOutletWithClient(
    @Body() createOutletWithClientDto: CreateOutletWithClientDto,
  ): Promise<{
    message: string;
    outlet: OutletEntity;
    client: ClientEntity;
    address: AddressEntity;
  }> {
    return await this.outletAdminService.createOutletWithClient(
      createOutletWithClientDto,
    );
  }

  @ApiOperation({
    summary: 'list out all the existing outlets',
  })
  @Get('outlets')
  async getAllOutlets(): Promise<OutletInterface[]> {
    return this.outletAdminService.getAllOutlets();
  }

  @ApiOperation({
    summary: 'updates the outlet details',
  })
  @Patch('outlet/:outletId')
  async updateOutlet(
    @Param('outletId') outletId: number,
    @Body() updateOutletDto: Partial<CreateOutletDto>,
  ): Promise<CreateOutletDto> {
    return await this.outletAdminService.updateOutletByIdOrThrow(
      outletId,
      updateOutletDto,
    );
  }

  @ApiOperation({
    summary: 'To update the outlet status like LIVE,UNDER_CONSTRUCTION...',
  })
  @Patch('status/outlet/:outletId')
  async updateOutletStatus(
    @Param('outletId') outletId: number,
    @Body('status') status: OutletStatusEnum,
  ): Promise<OutletEntity> {
    const outlet = await this.outletAdminService.updateOutletStatus(
      outletId,
      status,
    );
    return outlet;
  }

  @ApiOperation({
    summary: 'deletes the existing outlets and clients associated with it',
  })
  @Delete('outlet/:outletId')
  async deleteOutlet(
    @Param('outletId') outletId: number,
    @Body() deleteOutletDto: DeleteOutletDto,
  ): Promise<string> {
    return await this.outletAdminService.deleteOutletByIdOrThrow(
      outletId,
      deleteOutletDto,
    );
  }

  @ApiOperation({
    summary: 'adds new client to the existing outlet',
  })
  @Post('add-client/outlet/:outletId')
  async addClientToAnExistingOutlet(
    @Param('outletId') outletId: number,
    @Body() registerClientDto: RegisterClientDto,
  ): Promise<ClientEntity> {
    return await this.outletAdminService.addClientToAnExistingOutlet(
      outletId,
      registerClientDto,
    );
  }

  @ApiOperation({
    summary: 'fetch all the details of an outlet by outletId',
  }) 
  @Get('outlet/:outletId')
  async getOutletDetailsByOutletId(
    @Param('outletId') outletId:number
  ):Promise<OutletEntity>{
    return this.outletService.getOutletByIdOrThrow(outletId);
  } 

  @Get('countries')
  getCountries():CountryInterface[]{
    return this.outletAdminService.getAllCountries();
  }

  @Get('states/:countryCode')
  getStates(@Param('countryCode') countryCode: string):StateInterface[] {
    return this.outletAdminService.getStatesByCountry(countryCode);
  }

  @Get('country-code/:countryCode/state-code/:stateCode/cities')
  getCities(
    @Param('countryCode') countryCode: string,
    @Param('stateCode') stateCode: string,
  ):CityInterface[]{
    return this.outletAdminService.getCitiesByState(countryCode, stateCode);
  }
}
