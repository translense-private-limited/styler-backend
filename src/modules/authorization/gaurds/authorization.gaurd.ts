// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isPublicKey } from '@src/utils/decorators/public.decorator';
import { UserTypeEnum } from '@src/utils/enums/user-type.enum';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isPublic =
      this.reflector.get<boolean>(isPublicKey, context.getHandler()) ||
      this.reflector.get<boolean>(isPublicKey, context.getClass());

    if (isPublic) {
      return true;
    }
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

    let userType: UserTypeEnum;

    //@ts-expect-error //user added to request body during authentication process
    if (request.user.adminId) userType = UserTypeEnum.ADMIN;
    //@ts-expect-error //user added to request body during authentication process
    else if (request.user.clientId) userType = UserTypeEnum.CLIENT;
    //@ts-expect-error //user added to request body during authentication process
    else if (request.user.customerId) userType = UserTypeEnum.CUSTOMER;

    if (firstSegment.toUpperCase() === userType) {
      return true;
    }
    return false;
  }
}
