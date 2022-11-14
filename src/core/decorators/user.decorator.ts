import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserType } from '@modules/user/etc/user.schema';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserType;
  },
);
