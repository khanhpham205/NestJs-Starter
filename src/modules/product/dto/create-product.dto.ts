import { IsAlphanumeric, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsAlphanumeric()
    price: number;

    @IsOptional()
    Tags: Types.ObjectId[];

    @IsOptional()
    @IsString()
    description: string;
    
    @IsOptional()
    @IsString()
    image: string; //url of the image

}
