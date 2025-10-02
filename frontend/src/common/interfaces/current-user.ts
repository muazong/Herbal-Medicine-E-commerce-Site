import { Media } from './media';

export interface CurrentUser {
  id: string;
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
  updatedAt: string;
  createdAt: string;
}
