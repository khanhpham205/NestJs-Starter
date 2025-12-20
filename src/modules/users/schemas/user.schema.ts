import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'user' })
export class User {
    @Prop({ unique: true })
    _id: string;

    @Prop()
    userName: number;

    @Prop()
    hashedPassword: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
