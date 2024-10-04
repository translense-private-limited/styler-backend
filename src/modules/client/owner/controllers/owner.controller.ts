import { Body, Controller, Get, Post } from "@nestjs/common";
import { OwnerService } from "../services/owner.service";
import { CreateOwnerDto } from "../dtos/owner.dto";
import { Public } from "@src/utils/decorators/public.decorator";

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get()
  findAll() {
    return this.ownerService.findAll();
  }

  @Post()
  @Public()
  async createSeller(@Body() createOwnerDto: CreateOwnerDto) {
    console.log('create seller called ')
      return this.ownerService.createSeller(createOwnerDto);
  }
}