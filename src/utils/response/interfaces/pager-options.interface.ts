import { PagerDto } from '../dtos/pager.dto';

export interface PagerOptions {
  readonly pagerDto: PagerDto;
  readonly totalCount: number;
}
