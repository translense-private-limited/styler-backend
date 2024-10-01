import { PagerOptions } from './pager-options.interface';

export interface SuccessResponse<T> {
  readonly data: T;
  readonly pagerOptions?: PagerOptions;
}
