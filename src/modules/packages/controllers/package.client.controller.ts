import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { PackageService } from "../services/package.service";
import { UpdatePackageDto } from "../dtos/update-package.dto";
import { CreatePackageDto } from "../dtos/create-package-dto";
import { ApiTags } from "@nestjs/swagger";
import { PackageSchema } from "../schema/package-schema";

@Controller('client')
@ApiTags('Packages')
export class PackageClientController {
    constructor(private readonly packageService: PackageService) { }

    @Post("package")
    async createPackage(
        @Body() createPackageDto: CreatePackageDto,
    ): Promise<PackageSchema> {
        return this.packageService.createPackage(createPackageDto);
    }

    @Get("/package/:id")
    async getPackageById(
        @Param("id") id: string,
    ): Promise<PackageSchema> {
        return this.packageService.findPackageById(id);
    }

    @Put(":id")
    async updatePackage(
        @Param("id") id: string,
        @Body() updatePackageDto: UpdatePackageDto,
    ): Promise<PackageSchema> {
        return this.packageService.updatePackage(id, updatePackageDto);
    }

    @Delete("package/:id")
    async deletePackage(@Param("id") id: string): Promise<void> {
        this.packageService.deletePackage(id);
    }
}