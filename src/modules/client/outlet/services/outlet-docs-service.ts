import { Injectable } from "@nestjs/common";
import { OutletDocsRepository } from "../repositories/outlet-docs.repository";
import { OutletDocsEntity } from "../entities/outlet-docs.entity";

@Injectable()
export class OutletDocsService{
    constructor(
        private readonly outletDocsRepository:OutletDocsRepository
    ){}

    async getOutletDocsByOutletId(outletId:number):Promise<OutletDocsEntity>{
        return await this.outletDocsRepository.getRepository().findOne({ where: { outletId } });
    }
    
    async saveOutletGst(outletId: number, gstKey: string): Promise<void> {
        const queryRunner = this.outletDocsRepository.getRepository().manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
    
        try {
            // Use upsert to handle both insert and update scenarios
            await queryRunner.manager.upsert(
                OutletDocsEntity,
                { outletId, gstKey }, // Data to insert or update
                ['outletId'] // Conflict detection based on outletId
            );
    
            // Commit the transaction
            await queryRunner.commitTransaction();
        } catch (error) {
            // Rollback the transaction in case of errors
            await queryRunner.rollbackTransaction();
            throw error; // Rethrow the error to handle it elsewhere
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }
    
    async saveOutletRegistration(outletId: number, registrationKey: string): Promise<void> {
        const queryRunner = this.outletDocsRepository.getRepository().manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
    
        try {
            // Use upsert to handle both insert and update scenarios
            await queryRunner.manager.upsert(
                OutletDocsEntity,
                { outletId, registrationKey }, // Data to insert or update
                ['outletId'] // Conflict detection based on outletId
            );
    
            // Commit the transaction
            await queryRunner.commitTransaction();
        } catch (error) {
            // Rollback the transaction in case of errors
            await queryRunner.rollbackTransaction();
            throw error; // Rethrow the error to handle it elsewhere
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }    

    async saveOutletMou(outletId: number, mouKey: string): Promise<void> {
        const queryRunner = this.outletDocsRepository.getRepository().manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
    
        try {
            // Use upsert to handle both insert and update scenarios
            await queryRunner.manager.upsert(
                OutletDocsEntity,
                { outletId, mouKey }, // Data to insert or update
                ['outletId'] // Conflict detection based on outletId
            );
    
            // Commit the transaction
            await queryRunner.commitTransaction();
        } catch (error) {
            // Rollback the transaction in case of errors
            await queryRunner.rollbackTransaction();
            throw error; // Rethrow the error to handle it elsewhere
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }
    
}