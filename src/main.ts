import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');

    console.log(`port : ${port}`);
    await app.listen(port);
}
bootstrap();
