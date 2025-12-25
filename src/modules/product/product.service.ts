import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model, Types } from 'mongoose';
import { ProductDocument } from './schemas/products.schema';
import { TagsDocument } from '../tags/schemas/tags.schema';

@Injectable()
export class ProductService {
    constructor(
        private readonly productModel: Model<ProductDocument>
    ) {}
    
    async create(createProductDto: CreateProductDto) {
        try {
            // should handle file upload and add url to record
            await this.productModel.create(createProductDto);
            return 'Product created successfully';
        } catch (error) {
            return 'Could not create Product';
        }
    }
    
    async findAllByIncludeTags(
        page: number,
        limit: number,
        tags: Types.ObjectId []
    ) {
        page = Number.isInteger(page) && page > 0 ? page : 1;
        limit = Number.isInteger(limit) && limit > 0 ? limit : 1;
        try {
            const products = this.productModel
                .find({
                    tags: { $in: tags },
                    isDeleted: false
                })
                .populate('Tags')
                .exec();
            return products;
        } catch (error) {
            return 'Could not get Products';
        }
    }

    async findAllByHaveAllTags(
        page: number,
        limit: number,
        tags: Types.ObjectId []
    ) {
        // by tags, limit, page
        page = Number.isInteger(page) && page > 0 ? page : 1;
        limit = Number.isInteger(limit) && limit > 0 ? limit : 1;
        try {
            const products = this.productModel
                .find({
                    tags: { $all: tags }, 
                    isDeleted: false
                })
                .populate('Tags')
                .exec();
            return products;
        } catch (error) {
            return 'Could not get Products';
        }
    }

    async findAll(
        page: number, 
        limit: number, 
    ) {
        // by tags, limit, page
        page = Number.isInteger(page) && page > 0 ? page : 1;
        limit = Number.isInteger(limit) && limit > 0 ? limit : 1;
        try {
            const products = this.productModel
                .find()
                .populate('Tags')
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();
            return products;
        } catch (error) {
            return 'Could not get Products';
        }
    }

    findOne(id: number) {
        try {
            const product = this.productModel
                .findById(id)
                .populate('Tags')
                .exec();
            return product; 
        } catch (error) {
            return 'Could not get Product';
        }
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        try {
            await this.productModel
            .findByIdAndUpdate(id, updateProductDto)
            .exec();
            return 'Product updated successfully';
        } catch (error) {
            return 'Could not update Product';
        }
    }

    async remove(id: number) {
        // soft delete
        try {
            const product = await this.productModel.findById(id).exec();
            if (!product) {
                throw new Error('Product not found');
            }
            product.deletedAt = new Date();
            product.isDeleted = true;
            await product.save();
            return 'Product soft deleted successfully';
        } catch (error) {
            return 'Could not delete Product';
        }
    }
}
