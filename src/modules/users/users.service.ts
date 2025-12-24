import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordUserDto } from './dto/change-password.dto';

import { hashPassword, matchPassword } from '@/utils/password';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) 
        private readonly userModel: Model<User>){}

    async isEmailExisting(email: string): Promise<boolean> {
        return await this.userModel.exists({ email }).then( result => !!result );
    }

    async create(createUserDto: CreateUserDto) {
        if (await this.isEmailExisting(createUserDto.email)) {
            throw new BadRequestException('User with this email already exists');
        }

        const hashedPassword = await hashPassword( createUserDto.password );
        
        await this.userModel.create({
            userName: createUserDto.userName,
            email: createUserDto.email,
            hashedPassword: hashedPassword,
        });
        return 'User created successfully'; 
    }

    async changePassword(_id: string, createUserDto: ChangePasswordUserDto) {
        const user = await this.userModel
            .findById(_id)
            .select('_id hashedPassword')
            .exec();
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isOldPasswordValid = await matchPassword(
            createUserDto.oldPassword,
            user.hashedPassword,
        );
        if(!isOldPasswordValid){
            throw new BadRequestException('Old password is incorrect');
        }
        const newHashedPassword = await hashPassword( createUserDto.oldPassword );
        await this.userModel.updateOne({ _id }, { hashedPassword: newHashedPassword }).exec();
        // should send email notification here
        return 'Password changed successfully';
    }

    async findAll(page: number, limit: number) {
        page = Number.isInteger(page) && page > 0 ? page : 1;
        limit = Number.isInteger(limit) && limit > 0 ? limit : 1;
        try {
            const users = await this.userModel
                .find()
                .select('-hashedPassword')
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();
            return [...users, { page, limit, totalpages: Math.ceil( await this.userModel.countDocuments() / limit ) }];
        } catch (error) {
            throw new BadRequestException('Could not get users');
        }
    }

    async findOne(id: string) {
        const user = await this.userModel
            .findById(id)
            .select('-hashedPassword')
            .exec();
        // console.log(user);
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ email }).exec();
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const update = await this.userModel.updateOne({ _id: id }, updateUserDto);
        if(!update.matchedCount){
            throw new BadRequestException('User not found');
        }
        return 'User updated successfully';
        // should send email notification here
    }

    async remove(id: string) {
        const user = await this.userModel
            .findById(id)
            .select('-hashedPassword')
            .exec();        
        if (!user) {
            throw new BadRequestException('User not found');
        }
        
        // Hard delete
        // await this.userModel.deleteOne({ _id: id }).exec();

        // Soft delete
        await this.userModel.updateOne({ _id: id }, { isDeleted: true, deletedAt: new Date() }).exec();

        // should send email notification here
        return `User deleted successfully`;
    }
}
