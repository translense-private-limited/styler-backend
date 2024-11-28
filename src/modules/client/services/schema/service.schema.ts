import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { GenderEnum } from '@src/utils/enums/gender.enums';

@Schema({ timestamps: true }) // This will automatically add `createdAt` and `updatedAt`
export class ServiceSchema extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  categoryId: mongoose.Schema.Types.ObjectId; // Reference to Category collection

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

  @Prop({ required: true })
  outletId: number;

  @Prop({required:true})
  whitelabelId:number;
}
export const ServiceModel = SchemaFactory.createForClass(ServiceSchema);
