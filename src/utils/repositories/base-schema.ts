import { Model, Document } from 'mongoose';
import { PagerDto } from '../response/dtos/pager.dto';
import { PagerResultInterface } from '../response/interfaces/pager-result.interface';
import { PagerOptionsInterface } from '../response/interfaces/pager-options.interface';

export class BaseSchema<T extends Document> {
  constructor(protected baseModel: Model<T>) {}

  DEFAULT_PER_PAGE = 10;
  DEFAULT_PAGE_NUMBER = 1;

  protected getPageNumber(pagerDto: PagerDto): number {
    return pagerDto.pageNumber ? pagerDto.pageNumber : this.DEFAULT_PAGE_NUMBER;
  }

  protected getSkip(pagerDto: PagerDto): number {
    return (this.getPageNumber(pagerDto) - 1) * this.getLimit(pagerDto);
  }

  protected getLimit(pagerDto: PagerDto): number {
    return pagerDto.perPage ? pagerDto.perPage : this.DEFAULT_PER_PAGE;
  }

  protected getPagerDto(pagerDto: PagerDto): PagerDto {
    return {
      pageNumber: this.getPageNumber(pagerDto),
      perPage: this.getLimit(pagerDto),
    };
  }

  getPagerResult(
    data: T[],
    totalCount: number,
    pagerDto: PagerDto,
  ): PagerResultInterface<T> {
    pagerDto = this.getPagerDto(pagerDto);
    const pagerOptions: PagerOptionsInterface = { pagerDto, totalCount };
    return { data, pagerOptions };
  }

  getRepository(): Model<T> {
    return this.baseModel; // This returns the Mongoose model
  }
}
