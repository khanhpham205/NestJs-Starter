import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    userId: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    hashedPassword: string;
}
