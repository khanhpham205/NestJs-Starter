import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import { AllExceptionsFilter } from './core/all-exceptions.filter';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Bảo mật & Hạ tầng
    app.use(helmet());
    app.use(compression());
    app.enableCors({
        origin: true,
        credentials: true,
    });

    // Versioning cho API
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // Pipes, Filters, Interceptors toàn cục
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
    app.useGlobalInterceptors(new TransformInterceptor());

    app.use(cookieParser());

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');
    await app.listen(port);
    console.log(`🚀 Server is running on: http://localhost:${port}/api/v1`);
}
void bootstrap();
