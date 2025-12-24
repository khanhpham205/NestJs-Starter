import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthSession } from './schema/auth.schema';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { UsersService } from '../users/users.service';

import { hashPassword, matchPassword } from '@/utils/password';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        @InjectModel(AuthSession.name)
        private readonly authModel: Model<AuthSession>,
    ) {}

    async register(registerDto: RegisterDto) {
        const hashedPassword = await hashPassword(registerDto.password);
        await this.usersService.create({
            userName: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
        });
        return { message: 'User registered successfully' };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        // return '123'
        const user = await this.usersService.findByEmail(email);
        if (
            !user || 
            !user.hashedPassword || 
            !await matchPassword( pass, user.hashedPassword as string)
        ) {
            throw new UnauthorizedException();
        }
        const { hashedPassword, ...result } = user.toObject();
        return result;
    }

    async login(user: any) {
        if(!user || !user._id){
            throw new UnauthorizedException();
        }
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };

        const access_token = this.jwtService.sign(payload);
        const refresh_token = randomBytes(64).toString('hex');

        await this.authModel.create({
            userId: user._id,
            refreshToken: refresh_token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return { access_token, refresh_token };
    }


    async clearRefreshToken(refreshToken: string) {
        await this.authModel.deleteOne({ refreshToken });
    }

    async refreshToken(refresh_token: string) {
        const authRecord = await this.authModel.findOne({
            refreshToken: refresh_token,
        });
        if (!authRecord) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.usersService.findOne(String(authRecord.userId));

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };

        const access_token = this.jwtService.sign(payload);
        return { access_token };
    }
}
