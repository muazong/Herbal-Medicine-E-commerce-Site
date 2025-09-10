import { SetMetadata } from '@nestjs/common';

import { Role } from '../enums';
import { ROLES_KEY } from '../contances';

export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLES_KEY, roles);
