import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    console.log('DatabaseExceptionFilter caught an exception:', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST; // Set the status code, e.g., 400 for a bad request

    response.status(status).json({
      statusCode: status,
      error: {
        code: 'DATABASE_ERROR',
        message: 'A database error occurred.',
        details: exception.message || null, // You can format or provide more details about the error here
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: response.getHeader('x-request-id') || null, // Optional, useful for tracing
      },
    });
  }
}
