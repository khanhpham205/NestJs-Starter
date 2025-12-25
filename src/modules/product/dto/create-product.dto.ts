import { IsAlphanumeric, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 }) // 19.99
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
