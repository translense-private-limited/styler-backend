import { Injectable } from '@nestjs/common';
import { SeedClientData } from '../data/client.data';
import { SeedOutletData } from '../data/outlets.data';
import { SeedRoleData } from '../data/roles.data';
import { SeedCategoryData } from '../data/category.data';
import { SeedAdminData } from '../data/admin.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly seedClientData: SeedClientData,
    private readonly seedOutletData: SeedOutletData,
    private readonly seedRoleData:SeedRoleData,
    private readonly seedCategoryData:SeedCategoryData,
    private readonly seedAdminData:SeedAdminData,
  ) {}

  async seedMySQL():Promise<void>{
    try{
      console.log("Starting mysql seeding...")

      await this.seedClientData.seedClients();
      await this.seedOutletData.seedOutlets();
      await this.seedRoleData.seedRoles();
      await this.seedAdminData.seedAdmins();
      

      console.log("Mysql seeding completed successfully")
    }
    catch(error){
      console.error("Error during mysql seeding:",error)
      throw error;
    }
  }

  async seedMongoDB():Promise<void>{
    try{
      console.log("MongoDB seeding started...")
      await this.seedCategoryData.seedCategories();
      console.log("completed MongoDB seeding")
    }catch(error){
      console.log("Error during MongoDB seeding");
      throw error;
    }
  }
 
}
