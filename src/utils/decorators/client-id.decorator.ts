import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClientIdDto } from '../dtos/client-id.dto';

export const ClientIdDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ClientIdDto => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;
    console.log(headers);
    const whitelabelId = parseInt(request.headers['whitelabelId'], 10);
    const outletIds = request.headers['outletIds'];
    const clientId = parseInt(request.headers['clientId'], 10);

    return { whitelabelId, outletIds, clientId };
  },
);
