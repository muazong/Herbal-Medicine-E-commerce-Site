import { Media } from './media';
import { AbstractInterface } from './abstract-interface';

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
  provider: 'local' | 'google' | 'github';
  role: 'client' | 'admin';
  status: string;
}
