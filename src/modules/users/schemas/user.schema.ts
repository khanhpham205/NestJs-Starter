import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'User' })
export class User {
    
    @Prop({required: true, trim: true , lowercase: true })
    userName: string;

    @Prop({
        required:true, 
        unique: true, 
        trim: true , 
        lowercase: true 
    })
    email: string;

    @Prop()
    hashedPassword: string;

    
    @Prop({ 
        enum:['user','admin'],
        default: 'user'
    })
    role: string;

    
    @Prop()
    phone: string;
    @Prop()
    address: string;


    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
