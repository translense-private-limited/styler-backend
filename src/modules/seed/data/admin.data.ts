import { AdminRepository } from "@modules/admin/Repositories/admin.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SeedAdminData {
    constructor(private readonly adminRepository: AdminRepository) {}

    async seedAdmins(): Promise<void> {
        const queryRunner = this.adminRepository.getRepository().manager.connection.createQueryRunner();
        try {
            await queryRunner.startTransaction();

            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
            await queryRunner.query('TRUNCATE TABLE admin;');
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
      
            const admins = [
                {
                    name: 'SUPER',
                    email: 'atul.singh@translense.com',
                    password: '$2b$12$7ExBjna610jcXFIi1Rf1Su/vm5K7nCVdEFfzhY8dv6M.upac.fnQ2',
                    contactNumber: 8400408888,
                    roleId: 1, 
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'ADMIN',
                    email: 'admin@translense.com',
                    password: '$2b$12$7ExBjna610jcXFIi1Rf1Su/vm5K7nCVdEFfzhY8dv6M.upac.fnQ2',
                    contactNumber: 9876543210,
                    roleId: 2, 
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            await this.adminRepository.getRepository().save(admins);
            await queryRunner.commitTransaction();
            console.log('admin table seeding completed');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error during admin table seeding:', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
