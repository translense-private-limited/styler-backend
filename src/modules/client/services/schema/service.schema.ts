import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenderEnum } from '@src/utils/enums/gender.enums';

@Schema({ timestamps: true }) // This will automatically add `createdAt` and `updatedAt`
export class ServiceSchema extends Document {
  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true })
  gender: GenderEnum;

  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  timeTaken: number;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;
}
export const ServiceModel = SchemaFactory.createForClass(ServiceSchema);
