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

    @Prop({
        unique: true,
        sparse:true
    })
    googleId: string;

    @Prop()
    verified: boolean;

    @Prop()
    picture: string;

    // @Prop()
    // googleAccessToken: string;
    
    // @Prop()
    // googleRefreshToken: string;

    // @Prop()
    // googleTokenExpiry: Date;




    @Prop({
        enum:['local', 'google'],
        default: 'local',
        required: true,
    })
    provider: string;


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
