import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordUserDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';

import {Request, Response}  from 'express';
import { Roles } from '@/decorator/roles.decorator';
import { Role } from '@/types/role.enum';
import { Public } from '@/decorator/custom';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    async me(@Req() req: Request) {
        return req.user;
    }
    

    @Post()
    @Public()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Post('change-password/:id')
    changePassword(@Param('id') _id: string, @Body() changePasswordUserDto: ChangePasswordUserDto) {
        return this.usersService.changePassword(_id,changePasswordUserDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.usersService.findAll(page,  limit);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
