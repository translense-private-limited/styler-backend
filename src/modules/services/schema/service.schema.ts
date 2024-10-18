

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import  { Document } from 'mongoose';

@Schema({ timestamps: true }) // This will automatically add `createdAt` and `updatedAt`
export class ServiceSchema extends Document {
  @Prop({ required: true })
  name: string; // e.g., Haircut, Facial

  @Prop()
  description: string; // Description of the service

  @Prop()
  category: string

  @Prop({ required: true })
  price: number; // Price of the service

  @Prop({ required: true })
  duration: number; // Duration in minutes (for time-based services)

@Prop({ required: true})
clientId: number

  @Prop({ type: String, enum: ['available', 'unavailable'], default: 'available' })
  availability: string; // Availability status of the service
}

export const ServiceModel = SchemaFactory.createForClass(ServiceSchema);
