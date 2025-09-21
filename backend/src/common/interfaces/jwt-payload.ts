import { AccountStatus, Role, UserProvider } from '../enums';

export interface JwtPayload {
  sub: string;
  fullName: string;
  role: Role;
  status: AccountStatus;
  type: UserProvider;
}
