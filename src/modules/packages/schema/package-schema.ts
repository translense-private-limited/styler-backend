import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PackageSchema extends Document {
    @Prop({ required: true })
    packageName: string;

    @Prop({
        type: [{
            serviceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to Service collection
            discount: { type: Number, required: true }, // Discount for this service
        }], required: true
    })
    services: { serviceId: mongoose.Schema.Types.ObjectId; discount: number }[]; // Array of services with discounts

    @Prop({ required: true })
    price: number; // Total price of the package

    @Prop({ required: true })
    discount: number; // Total discount for the package

    @Prop({ required: true })
    totalDuration: number; // Total duration of the package

    @Prop({ required: true })
    outletId: number; // ID of the outlet

    @Prop({ required: true, default: 1 })
    whitelabelId: number; // ID of the whitelabel
}

export const PackageModel = SchemaFactory.createForClass(PackageSchema);