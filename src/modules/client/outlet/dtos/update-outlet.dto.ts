import { PartialType } from '@nestjs/mapped-types';
import { CreateOutletDto } from './outlet.dto';

export class UpdateOutletDto extends PartialType(CreateOutletDto) {}
