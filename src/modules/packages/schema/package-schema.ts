import { ServiceSchema } from '@modules/client/services/schema/service.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PackageSchema extends Document {
    @Prop({ required: true })
    packageName: string;

    @Prop({
        type: [{
            serviceId: { type: mongoose.Schema.Types.ObjectId, ref: ServiceSchema.name, required: true },
            discount: { type: Number, required: true },
        }], required: true
    })
    services: { serviceId: mongoose.Schema.Types.ObjectId; discount: number }[];

    @Prop({ required: true })
    price: number;
    @Prop({ required: true })
    discount: number;

    @Prop({ required: true })
    totalDuration: number;

    @Prop({ required: true })
    outletId: number;

    @Prop({ required: true, default: 1 })
    whitelabelId: number;
}

export const PackageModel = SchemaFactory.createForClass(PackageSchema);