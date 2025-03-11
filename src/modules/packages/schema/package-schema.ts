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

// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document } from 'mongoose';

// @Schema({ timestamps: true })
// export class PackageSchema extends Document {
//     @Prop({ required: true })
//     packageName: string;

//     @Prop({
//         type: [{
//             _id: { type: mongoose.Schema.Types.ObjectId, required: true },
//             categoryId: { type: mongoose.Schema.Types.ObjectId },
//             gender: { type: String },
//             serviceName: { type: String },
//             price: { type: Number },
//             discount: { type: Number, default: 0 },
//             timeTaken: { type: Number },
//             about: { type: String },
//             description: { type: String },
//             outletId: { type: Number },
//             whitelabelId: { type: Number },
//             serviceImages: { type: [String], default: [] },
//             serviceVideos: { type: [String], default: [] },
//             subtypes: { type: [String], default: [] },
//             createdAt: { type: Date },
//             updatedAt: { type: Date },
//             __v: { type: Number },
//         }],
//         required: true,
//     })
//     services: {
//         _id: mongoose.Schema.Types.ObjectId;
//         categoryId?: mongoose.Schema.Types.ObjectId;
//         gender?: string;
//         serviceName?: string;
//         price?: number;
//         discount?: number;
//         timeTaken?: number;
//         about?: string;
//         description?: string;
//         outletId?: number;
//         whitelabelId?: number;
//         serviceImages?: string[];
//         serviceVideos?: string[];
//         subtypes?: string[];
//         createdAt?: Date;
//         updatedAt?: Date;
//     }[];

//     @Prop({ required: true })
//     price: number;

//     @Prop({ required: true })
//     discount: number;

//     @Prop({ required: true })
//     totalDuration: number;

//     @Prop({ required: true })
//     outletId: number;

//     @Prop({ required: true, default: 1 })
//     whitelabelId: number;
// }

// export const PackageModel = SchemaFactory.createForClass(PackageSchema);
