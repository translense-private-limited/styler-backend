import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ExceptionFilter,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { ResponseHandler } from '../response-handler';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private canLog(exception: HttpException): boolean {
    return !(
      exception instanceof NotFoundException ||
      exception instanceof BadRequestException ||
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    );
  }

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;

    this.logger.debug('exception', exception);

    if (process.env.ENVIRONMENT !== 'test') {
      this.logger.error(exception);
    }

    const ctx = host.switchToHttp();

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let data = undefined;

    if (exception instanceof HttpException) {
      data = exception.getResponse() as object;
    } else if ((exception as Record<string, string>).code === 'EBADCSRFTOKEN') {
      httpStatus = 403;
    }

    const responseBody = ResponseHandler.error(
      (exception as Record<string, string>).message,
      data,
    );

    if (ctx.getResponse<Response>().headersSent) {
      return;
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
