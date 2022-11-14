import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@enums/role.enum';
import { User } from '@modules/user/etc/user.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user: User = request.user;
    if (!user) return false;

    let roles: RoleType = this.reflector.get<RoleType>(
      'roles',
      context.getHandler(),
    );
    if (!roles) roles = RoleType.ADMIN;

    return roles <= user.role;
  }
}
