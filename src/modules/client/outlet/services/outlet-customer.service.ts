import { Injectable } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';
import { CustomerDecoratorDto } from '@src/utils/dtos/customer-decorator.dto';
import { ServiceExternalService } from '@modules/client/services/services/service-external.service';
import { OutletEntity } from '../entities/outlet.entity';
import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { AggregateRatingService } from '@modules/customer/review/services/aggregate-rating.service';
import { AggregatedRatingEntity } from '@modules/customer/review/entities/aggregate-rating.entity';
import { RatedServiceInterface } from '../interfaces/rated-service.interface';

@Injectable()
export class OutletCustomerService {
  constructor(
    private readonly outletRepository: OutletRepository,
    private readonly serviceExternalService: ServiceExternalService,
    private readonly aggregateRatingService: AggregateRatingService,
  ) {}

  async getNearbyOutlet(
    nearbyOutletDto: NearbyOutletDto,
  ): Promise<OutletEntity[]> {
    return this.outletRepository.getNearbyOutlet(nearbyOutletDto);
  }

  private async getRatingForServices(
    services: ServiceSchema[],
  ): Promise<AggregatedRatingEntity[]> {
    const serviceIds = services.map((service) => service._id.toString());
    const aggregatedRating =
      await this.aggregateRatingService.getRatingByServiceIds(serviceIds);

    return aggregatedRating;
  }

  private addRatingDataInServices(
    services: ServiceSchema[],
    ratings: AggregatedRatingEntity[],
  ): RatedServiceInterface[] {
    const ratingMap: Map<string, AggregatedRatingEntity> = new Map<
      string,
      AggregatedRatingEntity
    >();

    for (const rating of ratings) {
      ratingMap.set(rating.serviceId.toString(), rating);
    }

    const serviceWithRatingDetails = services.map((service) => {
      const rating = ratingMap.get(service._id);
      const ratedServiceDto = { ...service, ...rating };
      return ratedServiceDto;
    });

    //@ts-ignore
    return serviceWithRatingDetails;
  }

  async getAllServicesForAnOutlet(
    outletId: number,
  ): Promise<RatedServiceInterface[]> {
    const services =
      await this.serviceExternalService.getAllServicesForAnOutlet(outletId);

    const ratings = await this.getRatingForServices(services);

    const serviceWithRating = this.addRatingDataInServices(services, ratings);

    return serviceWithRating;
  }
  async getServiceByServiceAndOutletId(
    outletId: number,
    serviceId: string,
    customer: CustomerDecoratorDto,
  ): Promise<ServiceSchema> {
    return this.serviceExternalService.getServiceDetailsByServiceAndOutletIdOrThrow(
      outletId,
      serviceId,
      customer,
    );
  }
}
