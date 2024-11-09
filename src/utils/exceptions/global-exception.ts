import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    console.log('Global exception captured');

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

    // Structure the error response
    response.status(status).json({
      statusCode: status,
      error:
        exception.response?.error || exception.name || 'Internal Server Error',
      message:
        exception.response?.message ||
        exception.message ||
        'An unexpected error occurred',
      details: exception.response?.details || null, // Optional for additional info like validation errors
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: response.getHeader('x-request-id') || null, // In case you're using request IDs
      },
    });
  }
}
