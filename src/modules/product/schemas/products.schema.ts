import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, collection: 'Products' })
export class Product {
    
    @Prop({ 
        required: true, 
        unique: true 
    })
    name: string;
    
    @Prop({ 
        type: [{ 
            type: Types.ObjectId, 
            ref: 'Tags'
        }], 
        default: [] 
    })
    Tags: Types.ObjectId[];

    @Prop({ required: true })
    price: number;

    @Prop()
    description: string;
    
    @Prop()
    image: string;    

    @Prop()
    deletedAt: Date; // soft detele
    @Prop({ default: false })
    isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
