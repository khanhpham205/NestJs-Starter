import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/products.schema';
import { TagsSchema } from '../tags/schemas/tags.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { 
                name: 'Product', 
                schema: ProductSchema 
            }
        ]),


    ],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
