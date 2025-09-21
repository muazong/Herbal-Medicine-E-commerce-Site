import { AccountStatus, Role, UserProvider } from '../enums';

export interface RequestUser {
  id: string;
  fullName: string;
  role: Role;
  status: AccountStatus;
  type: UserProvider;
}
