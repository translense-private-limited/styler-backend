import { Injectable } from '@nestjs/common';

import { OutletRepository } from '../repositories/outlet.repository';
import { CreateOutletDto } from '../dtos/outlet.dto';
import { OutletEntity } from '../entities/outlet.entity';
import { throwIfNotFound } from '@src/utils/exceptions/common.exception';
import { DeleteOutletDto } from '../dtos/delete-outlet.dto';
import { OutletInterface } from '../interfaces/outlet.interface';
import { OutletDocsRepository } from '../repositories/outlet-docs.repository';
import { OutletDocsEntity } from '../entities/outlet-docs.entity';
import { In } from 'typeorm';

@Injectable()
export class OutletService {
  constructor(
    private outletRepository: OutletRepository,
    private readonly outletDocsRepository:OutletDocsRepository

  ) {}

  async createOutlet(createAddressDto: CreateOutletDto): Promise<OutletEntity> {
    const outlet = await this.outletRepository
      .getRepository()
      .save(createAddressDto);
    return outlet;
  }

  // Fetch all outlets
  async getAllOutlets(): Promise<OutletInterface[]> {
    return this.outletRepository.getAllOutletsWithOwner();
  }

  async getOutletByIdOrThrow(outletId: number): Promise<OutletEntity> {
    const outlet = await this.outletRepository
      .getRepository()
      .findOne({ where: { id: outletId },
      relations:['address'] });

    throwIfNotFound(outlet,`outlet with ${outletId} not found`)
    return outlet;
  }

  async deleteOutletByIdOrThrow(outletId: number,deleteOutletDto:DeleteOutletDto): Promise<string> {

    if (!deleteOutletDto.confirmation) {
      throw new Error('Confirmation is required to delete the outlet.');
    }

    const outlet = await this.outletRepository.getRepository().findOne({
      where: { id: outletId },
    });
    throwIfNotFound(outlet,`Outlet with ID ${outletId} not found`)

    await this.outletRepository.getRepository().remove(outlet);

    return "outlet deleted successfully";
  }

  async getOutletByEmailIdOrThrow(email: string): Promise<OutletEntity> {
    return await this.outletRepository.getRepository().findOne({ where: { email } });
  }

  async getOutletByContactNumber(contactNumber:string):Promise<OutletEntity>{
    return await this.outletRepository.getRepository().findOne({where:{phoneNumber:contactNumber}})
  }

  async getOutletDetailsByIds(outletIds:number[]):Promise<OutletEntity[]>{
    return this.outletRepository.getRepository().find({
      where:{id:In(outletIds)},
      relations:['address']
    })
}

  async getOutletDocsByOutletId(outletId:number):Promise<OutletDocsEntity>{
    return await this.outletDocsRepository.getRepository().findOne({ where: { outletId } });
  }

  async saveOutletGst(outletId: number, gstKey: string): Promise<void> {
    const queryRunner = this.outletDocsRepository.getRepository().manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
        // Check if the record exists
        const existingRecord = await this.getOutletDocsByOutletId(outletId);

        if (existingRecord) {
            // Update the existing record
            await queryRunner.manager.update(
                OutletDocsEntity,
                { outletId },
                { gstKey },
            );
        } else {
            // Create a new record
            const newRecord = queryRunner.manager.create(OutletDocsEntity, {
                outletId,
                gstKey,
            });
            await queryRunner.manager.save(newRecord);
        }

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
      // Check if the record exists
      const existingRecord = await this.getOutletDocsByOutletId(outletId);

      if (existingRecord) {
          // Update the existing record
          await queryRunner.manager.update(
              OutletDocsEntity,
              { outletId },
              { registrationKey },
          );
      } else {
          // Create a new record
          const newRecord = queryRunner.manager.create(OutletDocsEntity, {
              outletId,
              registrationKey,
          });
          await queryRunner.manager.save(newRecord);
      }

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
      // Check if the record exists
      const existingRecord = await this.getOutletDocsByOutletId(outletId);

      if (existingRecord) {
          // Update the existing record
          await queryRunner.manager.update(
              OutletDocsEntity,
              { outletId },
              { mouKey },
          );
      } else {
          // Create a new record
          const newRecord = queryRunner.manager.create(OutletDocsEntity, {
              outletId,
              mouKey,
          });
          await queryRunner.manager.save(newRecord);
      }

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

