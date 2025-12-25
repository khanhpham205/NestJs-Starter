import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsOptional()
    name: string;

    @IsOptional()
    Tags: string[];

    @IsOptional()
    price: number;

    
    @IsOptional()
    description: string;


    @IsOptional()
    image: string;    


}
