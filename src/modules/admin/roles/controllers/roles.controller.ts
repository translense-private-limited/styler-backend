import { Body, Controller, Get, Post, Param, Req, Patch, Delete } from '@nestjs/common';
import { rolesService } from '../services/roles.service';
import { rolesEntity } from '../entities/roles.entity';
import { CreaterolesDto } from '../dtos/roles.dto';
import { Request } from 'express';

@Controller('roles') // Global route
export class rolesController {
    constructor(private readonly rolesService: rolesService) { }

    @Post() // POST /out
    async createroles(
        @Body() createrolesDto: CreaterolesDto
    ): Promise<rolesEntity> {
        return this.rolesService.createroles(createrolesDto);
    }

    @Get() // GET /out
    async getAllroless(): Promise<rolesEntity[]> {
        return this.rolesService.getAllroless();
    }
}
