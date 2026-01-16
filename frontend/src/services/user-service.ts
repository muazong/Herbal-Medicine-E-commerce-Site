import { User } from '@/common/interfaces';
import { apiWithAuth } from './axios-instance-client';

export async function getUsers() {
  try {
    const res = await apiWithAuth.get('/users');
    if (!res.data) return [];
    return res.data as User[];
  } catch {
    return [];
  }
}

export async function updateUser(
  userId: string,
  userData: Partial<
    Omit<
      User,
      'id' | 'createdAt' | 'updatedAt' | 'role' | 'provider' | 'avatar'
    >
  >,
) {
  try {
    const res = await apiWithAuth.patch(`/users/${userId}`, {
      ...userData,
    });

    if (!res.data) return null;
    return res.data as User;
  } catch {
    return null;
  }
}
