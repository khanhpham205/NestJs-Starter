import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { extname, join } from 'path';

import { ProductService } from './product.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import mongoose, { Types } from 'mongoose';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Role } from '@/types/role.enum';
import { Roles } from '@/decorator/roles.decorator';
import { Public } from '@/decorator/custom';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    // @Roles(Role.ADMIN)
    @Public()
    @UseInterceptors(FileInterceptor('file', {
            storage: multer.memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 },
    }))
    create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.productService.create(createProductDto, file);
    }





    @Get()
    @Public()
    findAll(
        @Query('page') page: number, 
        @Query('limit') limit: number
    ) {
        return this.productService.findAll(page, limit);
    }

    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
        return this.productService.findOne(+id);
    }




    @Patch(':id')
    @Roles(Role.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productService.update(id, updateProductDto);
    }




    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}
