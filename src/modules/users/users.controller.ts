import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordUserDto } from './dto/change-password.dto';

import { Request } from 'express';
import { Roles } from '@/decorator/roles.decorator';
import { Role } from '@/types/role.enum';
import { Public } from '@/decorator/custom';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    me(@Req() req: Request) {
        return req.user;
    }

    @Post()
    @Public()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Post('change-password/:id')
    async changePassword(
        @Param('id') _id: string,
        @Body() changePasswordUserDto: ChangePasswordUserDto,
    ) {
        return await this.usersService.changePassword(
            _id,
            changePasswordUserDto,
        );
    }

    @Get()
    @Roles(Role.ADMIN)
    async findAll(@Query('page') page: number, @Query('limit') limit: number) {
        return await this.usersService.findAll(page, limit);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.usersService.remove(id);
    }
}
