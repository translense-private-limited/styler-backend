import { InjectRepository } from '@nestjs/typeorm';
import { OutletEntity } from '../entities/outlet.entity';
import { getMysqlDataSource } from '@modules/database/data-source';
import { Repository } from 'typeorm';
import { BaseRepository } from '@src/utils/repositories/base-repository';
import { ClientEntity } from '@modules/client/client/entities/client.entity';
import { OutletInterface } from '../interfaces/outlet.interface';

export class OutletRepository extends BaseRepository<OutletEntity> {
  constructor(
    @InjectRepository(OutletEntity, getMysqlDataSource())
    protected repository: Repository<OutletEntity>,
  ) {
    super(repository);
  }

  async getNearbyOutlet({
    latitude,
    longitude,
    radius = 5,
  }: {
    latitude: number;
    longitude: number;
    radius?: number;
  }): Promise<OutletEntity[]> {
    return this.repository
      .createQueryBuilder('outlet')
      .addSelect(
        `(6371 * ACOS(
      COS(RADIANS(:latitude)) * COS(RADIANS(outlet.latitude))
      * COS(RADIANS(outlet.longitude) - RADIANS(:longitude))
      + SIN(RADIANS(:latitude)) * SIN(RADIANS(outlet.latitude))
    ))`,
        'distance',
      )
      .where('outlet.latitude IS NOT NULL AND outlet.longitude IS NOT NULL')
      .having('distance <= :radius', { radius })
      .orderBy('distance', 'ASC')
      .setParameters({ latitude, longitude })
      .getMany();
  }

  async getAllOutletsWithOwner(): Promise<OutletInterface[]> {
    const outletData = await this.repository
      .createQueryBuilder('outlet')
      .leftJoinAndSelect('outlet.address', 'address')
      .leftJoin(ClientEntity, 'client', 'outlet.clientId = client.id') 
      .select([
        'outlet.id AS id',
        'outlet.name AS name',
        'outlet.description AS description',
        'outlet.status AS status',
        'outlet.latitude AS latitude',
        'outlet.longitude AS longitude',
        'outlet.phoneNumber AS phoneNumber',
        'outlet.email AS email',
        'outlet.website AS website',
        'outlet.clientId AS clientId',
        'outlet.addressId AS addressId',
        'address.addressId AS addressId',
        'address.propertyNumber AS propertyNumber',
        'address.country AS country',
        'address.state AS state',
        'address.district AS district',
        'address.city AS city',
        'address.pincode AS pincode',
        'address.street AS street',
        'address.landmark AS landmark',
        'address.outletId AS outletId',
        'client.name AS clientName',
      ])
      .getRawMany();
      const outlet = outletData.map((outlet) => ({
      outlet: {
        id: outlet.id,
        name: outlet.name,
        description: outlet.description,
        status: outlet.status,
        latitude: outlet.latitude,
        longitude: outlet.longitude,
        phoneNumber: outlet.phoneNumber,
        email: outlet.email,
        website: outlet.website,
        clientId: outlet.clientId,
        addressId:outlet.addressId,
        address: {
          addressId: outlet.addressId,
          propertyNumber: outlet.propertyNumber,
          country: outlet.country,
          state: outlet.state,
          district: outlet.district,
          city: outlet.city,
          pincode: outlet.pincode,
          street: outlet.street,
          landmark: outlet.landmark,
          outletId:outlet.outletId
        },
      },
      clientName: outlet.clientName, 

    }));
    return outlet;
  }
}
