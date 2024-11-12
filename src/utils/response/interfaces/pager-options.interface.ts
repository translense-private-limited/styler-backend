import { PagerDto } from '../dtos/pager.dto';

export interface PagerOptionsInterface {
  readonly pagerDto: PagerDto;
  readonly totalCount: number;
}
