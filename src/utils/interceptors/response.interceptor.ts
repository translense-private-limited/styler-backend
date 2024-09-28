import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<any> {
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map((data) => {
                // Successful response
                return {
                    status: response.statusCode,
                    data: data || {},
                    meta: {
                        timestamp: new Date().toISOString(),
                        requestId: response.getHeader('x-request-id') || null,
                        //@ts-ignore
                        //pagination: data.pagination
                    },
                };
            }),
            // catchError((error) => {
            //     // Error response
            //     console.log('catched here ', error)
            //     const formattedError = {
            //         status: error.status || 500,
            //         error: {
            //             code: error.code || error.response.error || 'INTERNAL_SERVER_ERROR',
            //             message: error.message || error.response.message || 'An unexpected error occurred',
            //             details: error.response || {},
            //         },
            //         meta: {
            //             timestamp: new Date().toISOString(),
            //             requestId: response.getHeader('x-request-id') || null,
            //         },
            //     };

            //     return throwError(() => formattedError); // Use throwError to return an observable
            // }),
        );
    }
}