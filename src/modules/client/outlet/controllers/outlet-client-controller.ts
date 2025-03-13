import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletClientService } from '../services/outlet-client-service';
import { OutletInterface } from '../interfaces/outlet.interface';
import { CityInterface, CountryInterface, StateInterface } from '../interfaces/address.interface';
import { OutletEntity } from '../entities/outlet.entity';
import { OutletService } from '../services/outlet.service';
import { DeleteOutletDto } from '../dtos/delete-outlet.dto';


@Controller('client')
@ApiTags('Outlet')
export class OutletClientController {
    constructor(private readonly outletClientService: OutletClientService,
        private readonly outletService: OutletService
    ) { }

    @Get('/outlets/client/:clientId')
    @ApiBearerAuth('jwt')
    async getOutletByClientId(
        @Param('clientId') clientId: string,
    ): Promise<OutletInterface[]> {
        return this.outletClientService.getOutletsByClientId(parseInt(clientId));
    }

    @Get('outlet/:outletId')
    async getOutletDetailsByOutletId(
        @Param('outletId') outletId: number
    ): Promise<OutletEntity> {
        return this.outletService.getOutletByIdOrThrow(outletId);
    }

    @ApiOperation({
        summary: 'updates the outlet details',
    })
    @Patch('outlet/:outletId')
    async updateOutlet(
        @Param('outletId') outletId: number,
        @Body() updateOutletDto: Partial<CreateOutletDto>,
    ): Promise<CreateOutletDto> {
        return await this.outletClientService.updateOutletByIdOrThrow(
            outletId,
            updateOutletDto,
        );
    }

    @ApiOperation({
        summary: 'deletes the existing outlets and clients associated with it',
    })
    @Delete('outlet/:outletId')
    async deleteOutlet(
        @Param('outletId') outletId: number,
        @Body() deleteOutletDto: DeleteOutletDto,
    ): Promise<string> {
        return await this.outletService.deleteOutletByIdOrThrow(
            outletId,
            deleteOutletDto,
        );
    }

    @Get('countries')
    getCountries(): CountryInterface[] {
        return this.outletClientService.getAllCountries();
    }

    @Get('country/:countryCode/states')
    getStates(@Param('countryCode') countryCode: string): StateInterface[] {
        return this.outletClientService.getStatesByCountry(countryCode);
    }

    @Get('country-code/:countryCode/state-code/:stateCode/cities')
    getCities(
        @Param('countryCode') countryCode: string,
        @Param('stateCode') stateCode: string,
    ): CityInterface[] {
        return this.outletClientService.getCitiesByState(countryCode, stateCode);
    }
}
