import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@enums/role.enum';

export const Roles = (role: RoleType) => SetMetadata('roles', role);
