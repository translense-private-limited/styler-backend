import { Injectable } from '@nestjs/common';
import { SeedClientData } from '../data/client.data';
import { SeedOutletData } from '../data/outlets.data';
import { SeedRoleData } from '../data/roles.data';
import { SeedCategoryData } from '../data/category.data';
import { SeedAdminData } from '../data/admin.data';
import { SeedCustomerData } from '../data/customer.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly seedClientData: SeedClientData,
    private readonly seedOutletData: SeedOutletData,
    private readonly seedRoleData: SeedRoleData,
    private readonly seedCategoryData: SeedCategoryData,
    private readonly seedAdminData: SeedAdminData,
    private readonly seedCustomerData:SeedCustomerData
  ) {}

  async seedMySQL(): Promise<void> {
    try {

      await this.seedClientData.seedClients();
      await this.seedOutletData.seedOutlets();
      await this.seedRoleData.seedRoles();
      await this.seedAdminData.seedAdmins();
      await this.seedCustomerData.seedCustomers();

      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  async seedMongoDB(): Promise<void> {
    try {
      await this.seedCategoryData.seedCategories();
      return;
    } catch (error) {
      throw new Error(error);
    }
  }
}
