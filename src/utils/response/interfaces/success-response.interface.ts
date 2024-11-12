import { PagerOptionsInterface } from './pager-options.interface';

export interface SuccessResponseInterface<T> {
  readonly data: T;
  readonly pagerOptions?: PagerOptionsInterface;
}
