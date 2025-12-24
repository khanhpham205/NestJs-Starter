import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    
    
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');
    await app.listen(port);

    // console.clear();
    // console.log(`Server is running on port : ${port}`);
}
bootstrap();
