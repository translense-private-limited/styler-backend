import { Injectable } from "@nestjs/common";
import { ClientDocsRepository } from "../repository/client-docs.repository";
import { ClientDocsEntity } from "../entities/client-docs.entity";

@Injectable()
export class ClientDocsService{
    constructor(
        private readonly clientDocsRepository:ClientDocsRepository
    ){}

        async getClientDocsByClientId(clientId:number):Promise<ClientDocsEntity>{
            return await this.clientDocsRepository.getRepository().findOne({where:{clientId}});
        }
    
        async saveClientAadhaar(clientId: number, key: string): Promise<void> {
            const queryRunner = this.clientDocsRepository.getRepository().manager.connection.createQueryRunner();
            await queryRunner.startTransaction();
        
            try {
                // Use upsert to handle both insert and update scenarios
                await queryRunner.manager.upsert(
                    ClientDocsEntity,
                    { clientId, aadhaarKey: key }, // Data to insert or update
                    ['clientId'] // Conflict detection based on clientId
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
    
    
        async saveClientPan(clientId: number, panKey: string): Promise<void> {
            const queryRunner = this.clientDocsRepository.getRepository().manager.connection.createQueryRunner();
            await queryRunner.startTransaction();
        
            try {
                // Use upsert to handle both insert and update scenarios
                await queryRunner.manager.upsert(
                    ClientDocsEntity,
                    { clientId, panKey },
                    ['clientId'] // Specify the unique constraint or primary key to check for conflicts
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