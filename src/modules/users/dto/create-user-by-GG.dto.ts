import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserGoogleDto {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    googleId: string;

    @IsOptional()
    @IsNotEmpty()
    verified: boolean;
    // @Optional()
    // @IsString()
    // googleAccessToken:string

    // @Optional()
    // @IsString()
    // googleRefreshToken:string

    // @Optional()
    // @IsDate()
    // googleTokenExpiry:Date;
}
