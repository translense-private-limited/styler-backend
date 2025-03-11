import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { UpdatePackageDto } from "../dtos/update-package.dto";
import { CreatePackageDto } from "../dtos/create-package-dto";
import { ApiTags } from "@nestjs/swagger";
import { PackageSchema } from "../schema/package-schema";
import { PackageClientService } from "../services/package.client.service";

@Controller('client')
@ApiTags('Packages')
export class PackageClientController {
    constructor(private readonly packageClientService: PackageClientService) { }

    @Post("package")
    async createPackage(
        @Body() createPackageDto: CreatePackageDto,
    ): Promise<PackageSchema> {
        return this.packageClientService.createPackageByClient(createPackageDto);
    }

    @Get("/outlet/:outletId/packages")
    async getPackageByOutletId(
        @Param("outletId") outletId: number,
    ): Promise<PackageSchema[]> {
        return this.packageClientService.findAllPackagesByOutletId(outletId);
    }

    @Get("/package/:id")
    async getPackageById(
        @Param("id") id: string,
    ): Promise<PackageSchema> {
        return this.packageClientService.findPackageById(id);
    }

    @Patch("/package/:id")
    async updatePackage(
        @Param("id") id: string,
        @Body() updatePackageDto: UpdatePackageDto,
    ): Promise<PackageSchema> {
        return this.packageClientService.updatePackage(id, updatePackageDto);
    }

    @Delete("package/:id")
    async deletePackage(@Param("id") id: string): Promise<void> {
        this.packageClientService.deletePackage(id);
    }

}