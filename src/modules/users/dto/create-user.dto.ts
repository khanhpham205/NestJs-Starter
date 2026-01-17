import { Optional } from "@nestjs/common";
import { IsDate, IsNotEmpty, IsString, MinLength } from "class-validator";




export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    userName: string;
    
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}

