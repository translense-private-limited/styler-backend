import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'categories' })
export class CategorySchema extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true }) // e.g., Hair Care, Skin Care
  description: string; // Optional description of the category
}

export const CategoryModel = SchemaFactory.createForClass(CategorySchema);
