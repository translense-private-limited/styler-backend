import { ErrorResponseInterface } from './interfaces/error-response.interface';
import { PagerOptionsInterface } from './interfaces/pager-options.interface';
import { SuccessResponseInterface } from './interfaces/success-response.interface';

export class ResponseHandler {
  static success<T>(data: T, pagerOptions?: PagerOptionsInterface): SuccessResponseInterface<T> {
    return {
      data,
      pagerOptions,
    };
  }

  static error(message: string, data: object | undefined): ErrorResponseInterface {
    return {
      message,
      data,
    };
  }
}
