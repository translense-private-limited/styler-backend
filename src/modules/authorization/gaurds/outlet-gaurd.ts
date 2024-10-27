import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@src/utils/decorators/public.decorator';

@Injectable()
export class OutletGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic =
      this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler()) ||
      this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getClass());

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Check if the path starts with '/client'
    const path = request.url; // Get the request URL
    if (!path.startsWith('/client')) {
      // If path does not start with '/client', allow access without further checks
      return true;
    }

    // If the path starts with '/client', proceed with the outlet checks

    // 1. Access the headers (assuming outletIds are passed in the headers)
    const headers = request.headers;
    const outletIds: number[] = headers.outletIds;

    // 2. Extract outletId from params, body, and query
    const outletIdFromParams = request.params?.outletId
      ? Number(request.params.outletId)
      : null;
    const outletIdFromBody = request.body?.outletId
      ? Number(request.body.outletId)
      : null;
    const outletIdFromQuery = request.query?.outletId
      ? Number(request.query.outletId)
      : null;

    // 3. Ensure outletId is consistent across all three sources
    const extractedOutletIds = {
      params: outletIdFromParams,
      body: outletIdFromBody,
      query: outletIdFromQuery,
    };

    const checkConsistency = (ids) => {
      const validIds = Object.values(ids).filter(
        (id) => id !== undefined && id !== null,
      );
      return validIds.every((id) => id === validIds[0]);
    };

    if (!checkConsistency(extractedOutletIds)) {
      throw new BadRequestException(
        'Malpractice detected: outletId mismatch across params, body, and query.',
      );
    }

    // 4. Get the consistent outletId (from params, body, or query)
    const outletId =
      outletIdFromParams || outletIdFromBody || outletIdFromQuery;

    // 5. Check if the user belongs to the outlet via outletIds in the headers
    const hasAccess = outletIds.includes(outletId);

    if (!hasAccess) {
      throw new UnauthorizedException(
        'You are not the authorized person to access outlet ',
      );
    }

    // If all checks pass, allow access
    return true;
  }
}
