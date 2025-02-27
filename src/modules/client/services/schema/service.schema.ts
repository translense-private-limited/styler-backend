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
  price: number;

  @Prop({required:false,type:Number,default:0})
  discount?:number

  @Prop({ required: true })
  timeTaken: number;

  @Prop({ required: true })
  about: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  outletId: number;

  @Prop({required:true,default:1})
  whitelabelId:number;

  @Prop({required:false})
  serviceImages:string[];

  @Prop({required:false})
  serviceVideos:string[];

  @Prop({ required: false, type: [Object], default: [] })
  subtypes: {
    id:string;
    name:string;
    gender:GenderEnum;
    price: number;
    timeTaken: number;
    discount?: number;
    description?: string;
    about?:string
    subtypeImages?:string[];
  }[];
}
export const ServiceModel = SchemaFactory.createForClass(ServiceSchema);
