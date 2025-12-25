import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsOptional()
    name: string;

    @IsOptional()
    Tags: Types.ObjectId[];

    @IsOptional()
    price: number;

    
    @IsOptional()
    description: string;


    @IsOptional()
    image: string;    


}
