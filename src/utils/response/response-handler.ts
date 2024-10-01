import { ErrorResponse } from './interfaces/error-response.interface';
import { PagerOptions } from './interfaces/pager-options.interface';
import { SuccessResponse } from './interfaces/success-response.interface';

export class ResponseHandler {
  static success<T>(data: T, pagerOptions?: PagerOptions): SuccessResponse<T> {
    return {
      data,
      pagerOptions,
    };
  }

  static error(message: string, data: object | undefined): ErrorResponse {
    return {
      message,
      data,
    };
  }
}
