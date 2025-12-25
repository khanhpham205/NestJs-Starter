import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model, Types } from 'mongoose';
import { Product } from './schemas/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join, extname } from 'path';



@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) 
        private readonly productModel: Model<Product>
    ) {}
    
    async create(
        createProductDto: CreateProductDto,
        file: Express.Multer.File,
    ) {
        try {
            const _id = new Types.ObjectId(); // product id
            // use memoryStorage to handle file upload
            // easy to want custom file path
            
            if(file) {
                // save file 
                const folder = join(
                    process.cwd(), 
                    `public/product`, 
                    _id.toString()
                );

                if (!existsSync(folder)) mkdirSync(folder, { recursive: true });
                
                const filename = `thumbnail-${Date.now()}${extname(file.originalname)}`;
                const filePath = join(folder, filename);
                
                
                createProductDto.image = `public/product/${_id.toString()}/${filename}`;
                
                const newProduct = await this.productModel.create({
                    _id,
                    ...createProductDto
                });

                writeFileSync(filePath, file.buffer);
                return newProduct;
            }
            return await this.productModel.create({ _id, ...createProductDto });
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Product already exists');
            }
            throw new InternalServerErrorException('Could not create product');   
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

    async update(id: string, updateProductDto: UpdateProductDto) {
        try {
            await this.productModel
            .findByIdAndUpdate(id, updateProductDto)
            .exec();
            return 'Product updated successfully';
        } catch (error) {
            return 'Could not update Product';
        }
    }

    async remove(id: string) {
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
