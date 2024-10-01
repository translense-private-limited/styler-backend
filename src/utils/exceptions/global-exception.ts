import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            status: status,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: exception.message || 'An unexpected error occurred.',
                details: exception.details || {},
            },
            meta: {
                timestamp: new Date().toISOString(),
                requestId: response.getHeader('x-request-id') || null,
            },
        });
    }
}