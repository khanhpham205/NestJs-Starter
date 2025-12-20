import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { TagsModule } from '@/modules/tags/tags.module';
import { ProductModule } from './modules/product/product.module';


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async( configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject :[ConfigService]
        }),
        AuthModule, 
        UsersModule, TagsModule, ProductModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
