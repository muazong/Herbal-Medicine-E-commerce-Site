import { Media } from './media';
import { AbstractInterface } from './abstract-interface';

export interface CurrentUser extends AbstractInterface {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: Media;
  cover?: Media;
  provider: 'local' | 'google' | 'github';
  role: 'client' | 'admin';
  status: string;
}
