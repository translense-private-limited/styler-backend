import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { BusinessHourService } from '../services/business-hour.service';
import { BusinessHourDto } from '../dtos/business-hour.dto';
import { BusinessHourEntity } from '../entities/business-hours.entity';
import { Public } from '@src/utils/decorators/public.decorator';

@Public()
@ApiBearerAuth('jwt')
@ApiTags('Client/Business Hours')
@Controller('client/outlet-business-hour')
export class BusinessHourController {
  constructor(private readonly businessHourService: BusinessHourService) {}

  @ApiOperation({
    summary: 'Create business hours for an outlet',
  })
  @ApiBody({
    description: 'api body',
    type: BusinessHourDto,
    examples: {
      example1: {
        summary: 'Standard business hours',
        value: {
          outletId: '1',
          weeklySchedule: {
            MONDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            TUESDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            WEDNESDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            THURSDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            FRIDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            SATURDAY: {
              openingTime: '10:00',
              closingTime: '16:00',
              isClosed: false,
            },
            SUNDAY: {
              openingTime: '00:00',
              closingTime: '00:00',
              isClosed: true,
            },
          },
        },
      },
    },
  })
  @Post()
  async createBusinessHours(
    @Body() createOperatingHoursDto: BusinessHourDto,
  ): Promise<BusinessHourEntity> {
    return await this.businessHourService.createOrUpdateBusinessHour(
      createOperatingHoursDto,
    );
  }

  @ApiOperation({
    summary: 'Updata business hours for an outlet',
  })
  @ApiBody({
    description: 'api body',
    type: BusinessHourDto,
    examples: {
      example1: {
        summary: 'Standard business hours',
        value: {
          outletId: '1',
          weeklySchedule: {
            MONDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            TUESDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            WEDNESDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            THURSDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            FRIDAY: {
              openingTime: '09:00',
              closingTime: '18:00',
              isClosed: false,
            },
            SATURDAY: {
              openingTime: '10:00',
              closingTime: '16:00',
              isClosed: false,
            },
            SUNDAY: {
              openingTime: '00:00',
              closingTime: '00:00',
              isClosed: true,
            },
          },
        },
      },
    },
  })
  @Put()
  async updateBusinessHour(
    @Body() updateBusinessHour: BusinessHourDto,
  ): Promise<BusinessHourEntity> {
    return await this.businessHourService.createOrUpdateBusinessHour(
      updateBusinessHour,
    );
  }

  @Get(':outletId')
  async getBusinessHour(
    @Param('outletId') outletId: number,
  ): Promise<BusinessHourEntity | string> {
    return await this.businessHourService.getBusinessHourByOutletId(outletId);
  }
}
