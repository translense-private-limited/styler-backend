import { PagerOptionsInterface } from './pager-options.interface';

export interface PagerResultInterface<T> {
  readonly data: T[];
  readonly pagerOptions?: PagerOptionsInterface;
}
