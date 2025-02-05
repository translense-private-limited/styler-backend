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
  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR; // General error status code

    // Handle duplicate entry errors specifically
    //@ts-ignore
    if (exception.driverError.code === 'ER_DUP_ENTRY') {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          //@ts-ignore
          code: exception.driverError.code,
          //@ts-ignore
          message: `Duplicate entry error`,
          details: {
            query: exception.query,
            parameters: exception.parameters,
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url,
          requestId: response.getHeader('x-request-id') || null, // Optional, useful for tracing
        },
      });
    } else {
      // Generic error handling for other types of query failures
      response.status(status).json({
        statusCode: status,
        error: {
          //@ts-ignore
          code: exception.code || 'DATABASE_ERROR',
          message: 'A database error occurred.',
          //@ts-ignore
          details: exception.sqlMessage || null, // Include additional details here
        },
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url,
          requestId: response.getHeader('x-request-id') || null, // Optional, useful for tracing
        },
      });
    }
  }
}
