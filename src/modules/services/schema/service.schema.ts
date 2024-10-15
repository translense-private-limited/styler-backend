import { Schema, Prop, SchemaFactory} from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Service extends Document{
    @Prop()
    name: string

    @Prop({
        required: true
    })
    price: number
}

export const ServiceSchema = SchemaFactory.createForClass(Service)