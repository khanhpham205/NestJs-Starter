import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Types  } from 'mongoose';


export type AuthDocument = HydratedDocument<AuthSession>;

@Schema({ timestamps: true, collection: 'AuthSession' })
export class AuthSession {

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    userId: Types.ObjectId;
    
    @Prop({ required: false })
    refreshToken: string;
    

    @Prop({ required: true, index: { expires: 0 }, })
    expiresAt: Date;
}

export const AuthSchema = SchemaFactory.createForClass(AuthSession);
