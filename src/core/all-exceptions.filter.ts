import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : { message: 'Internal server error' };

        let message: string | object = 'Internal server error';
        if (
            typeof exceptionResponse === 'object' &&
            exceptionResponse !== null
        ) {
            const responseObj = exceptionResponse as Record<string, unknown>;
            message =
                (responseObj.message as string | string[]) ||
                (responseObj.error as string) ||
                JSON.stringify(exceptionResponse);
        } else if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        }

        const responseBody: Record<string, unknown> = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(
                ctx.getRequest<Request>(),
            ) as string,
            message: message,
            error:
                exception instanceof HttpException
                    ? exception.name
                    : 'InternalServerError',
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
