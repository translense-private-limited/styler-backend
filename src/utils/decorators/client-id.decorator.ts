import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClientIdDto } from '../dtos/client-id.dto';

export const ClientIdDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ClientIdDto => {
    const request = ctx.switchToHttp().getRequest();
    request.headers;
    const whitelabelId = parseInt(request.headers['whitelabel-id'], 10);
    const outletIds = request.headers['outlet-ids'];
    const clientId = parseInt(request.headers['client-id'], 10);

    return { whitelabelId, outletIds, clientId };
  },
);
