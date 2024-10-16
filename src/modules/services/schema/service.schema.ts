

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true })
  seller: mongoose.Schema.Types.ObjectId; // The salon/spa offering the service

  @Prop({ type: String, enum: ['available', 'unavailable'], default: 'available' })
  availability: string; // Availability status of the service
}

export const ServiceModel = SchemaFactory.createForClass(ServiceSchema);
