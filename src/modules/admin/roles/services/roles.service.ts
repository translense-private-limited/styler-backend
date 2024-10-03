import { Injectable, NotFoundException } from '@nestjs/common';
import { rolesRepository } from '../repositories/roles.repository';
import { CreaterolesDto } from '../dtos/roles.dto';
import { rolesEntity } from '../entities/roles.entity';

@Injectable()
export class rolesService {
    constructor(private readonly rolesRepository: rolesRepository) { }

    // Create a new roles
    async createroles(createrolesDto: CreaterolesDto): Promise<rolesEntity> {
        return await this.rolesRepository.getRepository().save(createrolesDto);
    }

    // Fetch all roles
    async getAllroless(): Promise<rolesEntity[]> {
        return this.rolesRepository.getRepository().find();
    }

}
