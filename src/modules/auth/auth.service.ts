import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    private users = [
        {
            id: 1,
            email: 'admin@example.com',
            password: '$2b$10$...',
            name: 'Admin',
            role: 'admin',
        },
        {
            id: 2,
            email: 'user@example.com',
            password: '$2b$10$...',
            name: 'User',
            role: 'user',
        },
    ];

    async register(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = {
            id: this.users.length + 1,
            email: registerDto.email,
            name: registerDto.name,
            password: hashedPassword,
            role: 'user',
        };

        this.users.push(newUser);  // add to DB
        return { message: 'User registered successfully' };
    }

    async login(loginDto: LoginDto) {
        const user = this.users.find((u) => u.email === loginDto.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }
}
