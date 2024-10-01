import { PagerOptions } from './pager-options.interface';

export interface PagerResult<T> {
  readonly data: T[];
  readonly pagerOptions?: PagerOptions;
}
