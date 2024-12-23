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
        'address.addressId AS address_addressId',
        'address.houseNumber AS address_houseNumber',
        'address.country AS address_country',
        'address.state AS address_state',
        'address.district AS address_district',
        'address.city AS address_city',
        'address.pincode AS address_pincode',
        'address.street AS address_street',
        'address.landmark AS address_landmark',
        'address.outletId AS address_outletId',
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
          addressId: outlet.address_addressId,
          houseNumber: outlet.address_houseNumber,
          country: outlet.address_country,
          state: outlet.address_state,
          district: outlet.address_district,
          city: outlet.address_city,
          pincode: outlet.address_pincode,
          street: outlet.address_street,
          landmark: outlet.address_landmark,
          outletId:outlet.address_outletId
        },
      },
      clientName: outlet.clientName, 

    }));
    return outlet;
  }
}
