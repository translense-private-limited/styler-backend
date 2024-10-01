import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    response.status(status).json({
      status: status,
      error: {
        code: exceptionResponse.code || 'INVALID_INPUT',
        message: exceptionResponse.message || 'Invalid request.',
        details: {
          fieldErrors: exceptionResponse.details || null,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: response.getHeader('x-request-id') || null,
      },
    });
  }
}