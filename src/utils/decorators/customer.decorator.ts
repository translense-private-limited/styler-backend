import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomerDecoratorDto } from '../dtos/customer-decorator.dto';

export const CustomerDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CustomerDecoratorDto => {
    const request = ctx.switchToHttp().getRequest();

    const whitelabelId = parseInt(request.headers['whitelabel-id'], 10);

    const customerId = parseInt(request.headers['customer-id'], 10);

    const customerDetailDto = new CustomerDecoratorDto();
    ///customerDetailDto.contactNumber = request.user.
    customerDetailDto.whitelabelId = whitelabelId || 1;
    customerDetailDto.customerId = customerId;
    customerDetailDto.contactNumber = request.user.contactNumber;
    customerDetailDto.name = request.user.name;
    customerDetailDto.email = request.user.email;

    return customerDetailDto;
  },
);
