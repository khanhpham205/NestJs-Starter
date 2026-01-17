import {
    Controller,
    Post,
    Body,
    Res,
    Req,
    BadRequestException,
    UseGuards,
    Get,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { GoogleAuthGuard, LocalAuthGuard } from './passport/all-auth.guard';
import { register } from 'node:module';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('me')
    me(@Req() req: Request) {
        return req.user;
    

    @Post('register')
    @Public()
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    async login(
        @Body() loginDto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        // return req.user
        const { access_token, refresh_token } = await this.authService.login(
            req.user,
        );
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { access_token };
    }

    @Get('google')
    @Public()
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req) {
        // start GG Oauth2 flow
        // GG will redirect to GG login page
    }

    @Get('google/callback')
    @Public()
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(
        @Req() req: Request, 
        @Res({ passthrough: true }) res: Response
    ) {
        const a = await this.authService.loginWithGoogle(req.user);
        res.cookie('refresh_token', a.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {access_token : a.access_token};
    }

    @Post('logout')
    logout(
        @Req() req: Request ,
        @Res({ passthrough: true }) res: Response
    ) {
        const refresh_token = req.cookies?.refresh_token;
        this.authService.clearRefreshToken(refresh_token);
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }

    @Post('refresh')
    @Public()
    async refresh(
        @Req() req: Request, 
        @Res({ passthrough: true }) res: Response
    ) {

        try {
            const refresh_token = req.cookies?.refresh_token;
            
            if (!refresh_token) {
                throw new BadRequestException('No refresh token provided');
            }

            const result = await this.authService.refreshToken(refresh_token);
            
            return this.authService.refreshToken(refresh_token);
            return {
                message: 'Token refreshed successfully',
                access_token: result.access_token,
            };
        } catch (error) {
            // Clear invalid cookie
            res.clearCookie('refresh_token');
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}