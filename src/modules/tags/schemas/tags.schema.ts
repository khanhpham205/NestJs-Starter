import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Query } from 'mongoose';

export type TagsDocument = HydratedDocument<Tags>;

@Schema({ timestamps: true, collection: 'Tags' })
export class Tags {
    @Prop({ required: true, unique: true })
    tagName: string;


    @Prop()
    discription: string;
    
    @Prop()
    image: string;



    @Prop()
    deletedAt: Date; // soft detele
    @Prop({ default: false })
    isDeleted: boolean;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);