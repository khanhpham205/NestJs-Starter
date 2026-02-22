import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthSession } from './schema/auth.schema';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { UsersService } from '../users/users.service';

import { hashPassword, matchPassword } from '@/utils/password';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private configService: ConfigService,

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
            !(await matchPassword(pass, user.hashedPassword))
        ) {
            throw new UnauthorizedException();
        }
        const { hashedPassword, ...result } = user.toObject();
        return result;
    }

    async login(user: any) {
        if (!user || !user._id) {
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

    async loginWithGoogle(googleUser: any) {
        const {
            googleId,
            name,
            email,
            verified,
            picture,
            // accessToken,
            // refreshToken
        } = googleUser;

        const user = await this.usersService.findByEmail(email);
        // console.log(`emai: ${email}, id:${googleId}`);
        // console.log(googleUser);

        if (user) {
            // CASE 1: User tồn tại với cùng Google ID -> Login
            if (user.googleId === googleId) {
                return await this.login(user);
            }

            // CASE 2: User tồn tại với Google ID khác -> Không cho login
            if (user.googleId && user.googleId !== googleId) {
                throw new BadRequestException(
                    'This email is already linked to another Google account',
                );
            }
        }

        // CASE 3: User chưa tồn tại -> Tạo mới
        const newUser = await this.usersService.createWithGoogle({
            userName: name,
            email,
            googleId,
            verified,

            // googleAccessToken: accessToken,
            // googleRefreshToken: refreshToken,
            // googleTokenExpiry: new Date(Date.now() + 3600 * 1000),
        });
        // console.log(newUser);
        return await this.login(newUser);
    }
}
