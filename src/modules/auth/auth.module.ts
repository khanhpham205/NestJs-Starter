import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        JwtModule.register({
            secret: new ConfigService().get<string>('JWT_SECRET'),
            signOptions: {
                expiresIn: '1h',
            },
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
