import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;  // You can customize this based on the error

    response.status(status).json({
      status: status,
      error: {
        code: 'DATABASE_ERROR',
        message: 'A database error occurred.',
        details: {
          fieldErrors: exception.message,  // You can customize or format the error details here
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: response.getHeader('x-request-id') || null,
      },
    });
  }
}