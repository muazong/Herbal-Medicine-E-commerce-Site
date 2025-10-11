import { Media } from './media';
import { AbstractInterface } from './abstract-interface';
import { ACCOUNT_PROVIDERS, USER_ROLES } from '../enums';

export interface User extends AbstractInterface {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  avatar?: Media;
  cover?: Media;
  provider: ACCOUNT_PROVIDERS;
  role: USER_ROLES;
  status: string;
}
