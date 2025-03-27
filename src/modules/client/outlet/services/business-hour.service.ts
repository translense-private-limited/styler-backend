import { BusinessHourRepository } from '../repositories/business-hour.repository';
import { BusinessHourDto } from '../dtos/business-hour.dto';
import { BusinessHourEntity } from '../entities/business-hours.entity';
import { OutletExternalService } from './outlet-external.service';
import { Injectable } from '@nestjs/common';
import { OutletEntity } from '../entities/outlet.entity';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';

@Injectable()
export class BusinessHourService {
  constructor(
    private businessHourRepository: BusinessHourRepository,
    private outletExternalService: OutletExternalService,
  ) {}

  private prepareBusinessHourInstance(
    createBusinessHourDto: BusinessHourDto,
    outlet: OutletEntity,
  ): BusinessHourEntity {
    const businessEntityInstance = new BusinessHourEntity();
    businessEntityInstance.outlet = outlet;
    // businessEntityInstance.outletId = outlet.id;
    businessEntityInstance.weeklySchedule =
      createBusinessHourDto.weeklySchedule;

    return businessEntityInstance;
  }

  async createOrUpdateBusinessHour(
    createBusinessHourDto: BusinessHourDto,
  ): Promise<BusinessHourEntity> {
    const outlet = await this.outletExternalService.getOutletByIdOrThrow(
      createBusinessHourDto.outletId,
    );

    let businessHourInstance = this.prepareBusinessHourInstance(
      createBusinessHourDto,
      outlet,
    );

    const existingBusinessHours =
      (await this.businessHourRepository.getRepository().findOne({
        where: {
          outlet: { id: createBusinessHourDto.outletId },
        },
      })) ?? {};

    businessHourInstance = {
      ...existingBusinessHours,
      ...businessHourInstance,
    };

    await this.businessHourRepository
      .getRepository()
      .save(businessHourInstance);
    return businessHourInstance;
  }

  async getBusinessHourByOutletId(
    outletId: number,
  ): Promise<BusinessHourEntity | string> {
    const businessHour = await this.businessHourRepository
      .getRepository()
      .findOne({
        where: {
          outlet: { id: outletId },
        },
      });

    if (!businessHour) {
      return `Please add the business hours`;
    }

    return businessHour;
  }
}
