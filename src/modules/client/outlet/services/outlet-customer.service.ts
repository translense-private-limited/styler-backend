import { Injectable } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { NearbyOutletDto } from '../dtos/nearby-outlet.dto';

@Injectable()
export class OutletCustomerService {
  constructor(private outletRepository: OutletRepository) {}

  async getNearbyOutlet(nearbyOutletDto: NearbyOutletDto) {
    return this.outletRepository.getNearbyOutlet(nearbyOutletDto);
  }
}
