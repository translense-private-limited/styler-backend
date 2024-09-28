import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PaginationParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { pageNumber, perPage } = request.query;

    return {
      pageNumber: parseInt(pageNumber, 10) || undefined,
      perPage: parseInt(perPage, 10) || undefined,
    };
  },
);
