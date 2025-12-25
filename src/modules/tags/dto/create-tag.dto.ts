import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTagDto {

    @IsNotEmpty()
    @IsString()
    tagName: string;

    @IsOptional()
    @IsString()
    discription: string;

    @IsString()
    @IsOptional()
    image: string;
    
    
}
