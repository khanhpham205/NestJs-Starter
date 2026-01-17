import { Optional } from "@nestjs/common";
import { IsDate, IsNotEmpty, IsString, MinLength } from "class-validator";




export class CreateUserGoogleDto {
    @IsNotEmpty()
    @IsString()
    userName: string;
    
    @IsNotEmpty()
    @IsString()
    email: string;

    @Optional()
    @IsString()
    googleId:string

    @Optional()
    @IsNotEmpty()
    verified:boolean;
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

