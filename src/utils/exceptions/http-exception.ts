import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    console.log('HttpExceptionFilter caught an exception', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exceptionResponse: any = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      error: {
        code: exceptionResponse.code || 'INVALID_REQUEST',
        message: exceptionResponse.message || 'An unexpected error occurred.',
        details: exceptionResponse.details || null, // Optional, for additional error context (like validation)
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: response.getHeader('x-request-id') || null, // Optional for request tracing
      },
    });
  }
}
