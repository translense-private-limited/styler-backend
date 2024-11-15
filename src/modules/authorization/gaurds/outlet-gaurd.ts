import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isPublicKey } from '@src/utils/decorators/public.decorator';

@Injectable()
export class OutletGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public using the `@Public()` decorator.
    const isPublic =
      this.reflector.get<boolean>(isPublicKey, context.getHandler()) ||
      this.reflector.get<boolean>(isPublicKey, context.getClass());

    if (isPublic) {
      // Allow access if the route is public.
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Extract the request URL to check the path.
    const path = request.url;
    if (!path.startsWith('/client')) {
      // If the path does not start with '/client', skip outlet checks.
      return true;
    }

    // Proceed with outlet checks if the path starts with '/client'.

    // 1. Access outletIds from headers (assuming they are provided as an array).
    const headers = request.headers;
    const outletIds: number[] = headers.outletIds;

    // 2. Extract outletId from request params, body, and query.
    const outletIdFromParams = request.params?.outletId
      ? Number(request.params.outletId)
      : null;
    const outletIdFromBody = request.body?.outletId
      ? Number(request.body.outletId)
      : null;
    const outletIdFromQuery = request.query?.outletId
      ? Number(request.query.outletId)
      : null;

    // Combine the extracted outlet IDs into a single object.
    const extractedOutletIds = {
      params: outletIdFromParams,
      body: outletIdFromBody,
      query: outletIdFromQuery,
    };

    // Check if any of the outlet-related IDs are present and valid.
    const isOutletReferenced = validateOutletIdPresence(extractedOutletIds);
    if (!isOutletReferenced) {
      // If no valid outlet ID is found, skip further checks.
      return true;
    }

    /**
     * Ensures consistency of outletId across params, body, and query.
     * If multiple sources provide an outletId, they must all match.
     */
    const checkConsistency = (ids) => {
      const validIds = Object.values(ids).filter(
        (id) => id !== undefined && id !== null,
      );
      // All valid outlet IDs must be the same.
      return validIds.every((id) => id === validIds[0]);
    };

    if (!checkConsistency(extractedOutletIds)) {
      // Throw an error if outletId values from different sources do not match.
      throw new BadRequestException(
        'Malpractice detected: outletId mismatch across params, body, and query.',
      );
    }

    // 4. Determine the consistent outletId to use for authorization checks.
    const outletId =
      outletIdFromParams || outletIdFromBody || outletIdFromQuery;

    // 5. Verify if the user has access to the specified outletId based on outletIds in the headers.
    const hasAccess = outletIds.includes(outletId);

    if (!hasAccess) {
      // If the user is not authorized, throw an UnauthorizedException.
      throw new UnauthorizedException(
        'You are not the authorized person to access outlet',
      );
    }

    // If all checks pass, allow access.
    return true;
  }
}

/**
 * Checks if any of the extracted outlet IDs is a valid number.
 * This function validates if at least one outletId from params, body, or query is present and valid.
 * @param ids - An object containing outlet IDs from params, body, and query.
 * @returns {boolean} - Returns true if any of the outlet IDs is a valid number, otherwise false.
 */
const validateOutletIdPresence = (
  ids: Record<string, number | null>,
): boolean => {
  // Iterate over the extracted IDs and check if any is a valid number.
  return Object.values(ids).some((id) => typeof id === 'number' && !isNaN(id));
};
