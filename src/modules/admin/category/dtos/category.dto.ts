import { IsString } from 'class-validator';
import { CategoryInterface } from '../interfaces/category.interface';

export class CategoryDto implements CategoryInterface {
  @IsString()
  description: string;

  @IsString()
  name: string;
}
