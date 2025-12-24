import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { 
    IsString,
    MinLength
} from 'class-validator';

export class ChangePasswordUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @MinLength(6)
    oldPassword: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}