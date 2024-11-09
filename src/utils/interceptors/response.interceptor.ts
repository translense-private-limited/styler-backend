import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable,  } from 'rxjs';
import { map, } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
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
interface ResponseFormat<T> {
    status: number;
    data: T;
    meta: {
      timestamp: string;
      requestId: string | null;
      // pagination?: PaginationType; // Optional: add pagination if needed, with a specific type
    };
  }
  