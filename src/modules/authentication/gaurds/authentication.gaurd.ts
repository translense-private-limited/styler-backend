import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { isPublicKey } from '@src/utils/decorators/public.decorator';
import { Request } from 'express';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic =
      this.reflector.get<boolean>(isPublicKey, context.getHandler()) ||
      this.reflector.get<boolean>(isPublicKey, context.getClass());

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Please login and try again');
    }
    try {
      const payload = await this.jwtService.verifyToken(token);
      const headers = payload.headers;
      delete payload.headers;
      request['user'] = payload;
      request['headers'] = { ...request.headers, ...headers };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
