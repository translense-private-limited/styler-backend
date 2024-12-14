import { CustomerRepository } from "@modules/customer/repositories/customer.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SeedCustomerData {
    constructor(private readonly customerRepository: CustomerRepository) {}

    async seedCustomers(): Promise<void> {
        const queryRunner = this.customerRepository.getRepository().manager.connection.createQueryRunner();
        try {
            await queryRunner.startTransaction();

            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
            await queryRunner.query('TRUNCATE TABLE customers;');
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

            const customers = [
                {
                    name: 'Sample Customer',
                    email: 'customer@translense.com',
                    password: '$2b$10$We.1TuspN0s/OCg5UgkIte6s8aPreGZGpqXOcrDOze2hgKfLko8kC',
                    contactNumber: 9876543210, 
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            await this.customerRepository.getRepository().save(customers);
            await queryRunner.commitTransaction();
            console.log('customer table seeding completed');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error during customer table seeding:', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
