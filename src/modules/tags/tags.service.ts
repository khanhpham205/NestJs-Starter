import { BadRequestException, Injectable } from '@nestjs/common';
import { TagsDocument } from './schemas/tags.schema';
import { Model } from 'mongoose';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
    constructor(
        private readonly tagsModel: Model<TagsDocument>,
    ) {}


    async create(createTagDto: CreateTagDto) {
        try {
            await this.tagsModel.create(createTagDto);
            return 'Tag created successfully';
        } catch (error) {
            throw new BadRequestException('Could not create Tag');
        }
    }

    async findAll(page: number, limit: number) {
        page = Number.isInteger(page) && page > 0 ? page : 1;
        limit = Number.isInteger(limit) && limit > 0 ? limit : 1;
        try {
            const tags = await this.tagsModel
                .find({isDeleted: false})
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();
            return [
                ...tags, 
                {
                    page, 
                    limit, 
                    totalpages: Math.ceil( await this.tagsModel.countDocuments() / limit ) 
                }
            ];
        } catch (error) {
            throw new BadRequestException('Could not get Tags');
        }
    }

    async findAllDeleted(page: number, limit: number) {
        page = Number.isInteger(page) && page > 0 ? page : 1;
        limit = Number.isInteger(limit) && limit > 0 ? limit : 1;
        try {
            const tags = await this.tagsModel
                .find({ isDeleted: true })
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();
            return [
                ...tags, 
                {
                    page, 
                    limit, 
                    totalpages: Math.ceil( await this.tagsModel.countDocuments() / limit ) 
                }
            ];
        } catch (error) {
            throw new BadRequestException('Could not get Tags');
        }
    }
    
    async findOne(id: number) {
        try {
            const tag = await this.tagsModel
                .findById(id)
                .exec();
            if (!tag) {
                throw new BadRequestException('Tag not found');
            }
            return tag;
        } catch (error) {
            return 'Could not get Tag';
        }
    }

    async update(id: number, updateTagDto: UpdateTagDto) {
        try {
            await this.tagsModel.findByIdAndUpdate(id, updateTagDto).exec(); 
            return 'Tag updated successfully';
        } catch (error) {
            throw new BadRequestException('Could not update Tag');
        }
    }

    async remove(id: number) {
        try {
            const tag = await this.tagsModel.findById(id).exec();
            if (!tag) {
                throw new BadRequestException('Tag not found');
            }
            tag.deletedAt = new Date();
            tag.isDeleted = true;
            await tag.save();
            return 'Tag soft deleted successfully';
        } catch (error) {   
            return 'Could not delete Tag';
        }
    }
}
