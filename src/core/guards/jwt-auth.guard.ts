import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { METADATA_KEY } from '../constants/metadata.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if endpoint is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEY.IS_PUBLIC,
      [context.getHandler(), context.getClass()]
    );

    // Skip JWT verification for public endpoints
    if (isPublic) {
      return true;
    }

    // Proceed with standard JWT authentication
    return super.canActivate(context);
  }
}