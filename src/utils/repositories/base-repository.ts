import { ObjectLiteral, Repository } from 'typeorm';
import { PagerDto } from '../response/dtos/pager.dto';
import { PagerResult } from '../response/interfaces/pager-result.interface';
import { PagerOptions } from '../response/interfaces/pager-options.interface';

export class BaseRepository<T extends ObjectLiteral> {
  constructor(protected baseRepository: Repository<T>) { }

  DEFAULT_PER_PAGE = 10;
  DEFAULT_PAGE_NUMBER = 1;

  private getPageNumber(pagerDto: PagerDto): number {
    return pagerDto.pageNumber ? pagerDto.pageNumber : this.DEFAULT_PAGE_NUMBER;
  }

  getSkip(pagerDto: PagerDto): number {
    return (this.getPageNumber(pagerDto) - 1) * this.getLimit(pagerDto);
  }

  getLimit(pagerDto: PagerDto): number {
    return pagerDto.perPage ? pagerDto.perPage : this.DEFAULT_PER_PAGE;
  }

  getPagerDto(pagerDto: PagerDto): PagerDto {
    return {
      pageNumber: this.getPageNumber(pagerDto),
      perPage: this.getLimit(pagerDto),
    };
  }

  getPagerResult(
    data: T[],
    totalCount: number,
    pagerDto: PagerDto,
  ): PagerResult<T> {
    pagerDto = this.getPagerDto(pagerDto);
    const pagerOptions: PagerOptions = { pagerDto, totalCount };
    return { data, pagerOptions };
  }

  getRepository() {
    return this.baseRepository;
  }

  getEntityManager() {
    return this.baseRepository.manager;
  }
}
