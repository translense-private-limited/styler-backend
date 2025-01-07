import { Controller, Post } from '@nestjs/common';
import { SeedService } from '../services/seed.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@src/utils/decorators/public.decorator';

@ApiTags('seed')
@Public()
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  async seedData(): Promise<{ message: string }> {
    await this.seedService.seedMySQL();
    await this.seedService.seedMongoDB();
    return { message: 'Data seeding completed successfully' };
  }
}
