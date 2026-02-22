import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';

export interface Response<T> {
    statusCode: number;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
    T,
    Response<T>
> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const response = context.switchToHttp().getResponse<ExpressResponse>();
        return next.handle().pipe(
            map((data) => ({
                statusCode: response.statusCode,
                data: data,
            })),
        );
    }
}
