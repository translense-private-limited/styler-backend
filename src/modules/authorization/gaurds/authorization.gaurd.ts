// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const req = context.switchToHttp().getRequest();
    const isAuthorizedUserType = this.isUserAuthorizedToAccessPath(req);
    if (!isAuthorizedUserType) {
      return false;
    }

    // const meta = this.reflector.getAllAndMerge(requiredPermission, [
    //   context.getClass(),
    //   context.getHandler(),
    // ]);

    return true;
    // need to be reviewed and tested again and uncomment
    // if (!meta) {
    //   return true;
    // }

    // const user = req.user; // Replace with your actual user retrieval logic

    // if (!user || !user.roles) {
    //   throw new UnauthorizedException('User does not have required roles');
    // }

    // if (!false) {
    //   throw new UnauthorizedException('Insufficient permissions');
    // }

    // return true;
  }

  private isUserAuthorizedToAccessPath(request: Request): boolean {
    const path = request.url;
    const firstSegment = path.split('/')[1]; // Get the segment after the first '/'

    //@ts-expect-error //handled
    const { userType } = request.user;

    if (firstSegment.toUpperCase() === userType) {
      return true;
    }
    return false;
  }
}
