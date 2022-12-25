import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_KEY } from './public.guard';
import { Role } from 'src/graphql/graphql-schema';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequestContext(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  isPublicRoute(context: ExecutionContext) {
    return this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());
  }

  async canActivate(context: ExecutionContext) {
    const isPublicRoute = this.isPublicRoute(context);
    if (isPublicRoute) return true;

    const authenticated = await super.canActivate(context);
    if (!authenticated) return false;

    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!roles) return true;

    const request = this.getRequestContext(context);
    const user = request.user;

    return roles.some((role) => user.roles.includes(role));
  }
}
