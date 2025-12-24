import { Controller, Post, Body, Res, Req, BadRequestException, UseGuards, Get } from '@nestjs/common';
import {Request, Response}  from 'express';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() req: Request) {
        return req.user;
    }
    
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(
        @Body() loginDto: LoginDto, 
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        // return req.user
        return this.authService.login(req.user);
        // try {
        //     // const user = req.user;
        //     // if(!user){
        //     //     throw new BadRequestException('Invalid credentials');
        //     // }
        //     const { access_token, refresh_token} = await this.authService.login(loginDto);

        //     res.cookie('refresh_token', refresh_token, {
        //         httpOnly: true,
        //         secure: process.env.NODE_ENV === 'production',
        //         sameSite: 'none',
        //         maxAge: 7 * 24 * 60 * 60 * 1000,
        //     });
        //     return { access_token };
        // } catch (error) {
        //     throw error;
        // }
    }
    

    // @Post('logout')
    // logout(
    //     @Req() req: Request ,
    //     @Res({ passthrough: true }) res: Response
    // ) {
    //     const refresh_token = req.cookies?.refresh_token;
    //     this.authService.clearRefreshToken(refresh_token);
    //     res.clearCookie('refresh_token');
    //     return { message: 'Logged out successfully' };
    // }

    // @Post('refresh')
    // refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    //     const refresh_token = req.cookies?.refresh_token;
    //     if(!refresh_token){
    //         throw new BadRequestException('No refresh token provided');
    //     }
    //     return this.authService.refreshToken(refresh_token);
    // }

}
