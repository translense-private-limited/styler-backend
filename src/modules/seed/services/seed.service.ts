import { Injectable } from '@nestjs/common';
import { SeedClientData } from '../data/client.data';
import { SeedOutletData } from '../data/outlets.data';
import { SeedRoleData } from '../data/roles.data';
import { SeedCategoryData } from '../data/category.data';
import { SeedAdminData } from '../data/admin.data';
import { SeedCustomerData } from '../data/customer.data';
import { SeedAddressData } from '../data/address.data';
import { SeedServiceData } from '../data/service.data';
import { SeedClientOutletMappingData } from '../data/client-outlet-mapping.data';
import { SeedEventConfigurationData } from '../data/event-configuration.data';
import { SeedTimestampData } from '../data/aggregate-review-timestamp.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly seedClientData: SeedClientData,
    private readonly seedOutletData: SeedOutletData,
    private readonly seedClientOutletMapping:SeedClientOutletMappingData,
    private readonly seedRoleData: SeedRoleData,
    private readonly seedCategoryData: SeedCategoryData,
    private readonly seedAdminData: SeedAdminData,
    private readonly seedCustomerData:SeedCustomerData,
    private readonly seedAddressData:SeedAddressData,
    private readonly seedServiceData:SeedServiceData,
    // private readonly seedTimestampData:SeedTimestampData,
    private readonly seedEventConfigurationData:SeedEventConfigurationData
  ) {}

  async seedMySQL(): Promise<void> {
    try {

      await this.seedClientData.seedClients();
      await this.seedOutletData.seedOutlets();
      await this.seedClientOutletMapping.seedClientOutletMappings();
      await this.seedRoleData.seedRoles();
      await this.seedAdminData.seedAdmins();
      await this.seedCustomerData.seedCustomers();
      await this.seedAddressData.seedAddresses();
      // await this.seedTimestampData.seedTimestamps();

      await this.seedEventConfigurationData.seedEventConfigurations();

      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  async seedMongoDB(): Promise<void> {
    try {
      await this.seedCategoryData.seedCategories();
      await this.seedServiceData.seedServices();
      return;
    } catch (error) {
      throw new Error(error);
    }
  }
}
