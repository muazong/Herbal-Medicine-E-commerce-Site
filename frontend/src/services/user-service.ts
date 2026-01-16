import { User } from '@/common/interfaces';
import { apiWithAuth } from './axios-instance-client';

export async function getUsers(page: number = 1) {
  try {
    const res = await apiWithAuth.get(`/users?page=${page}`);
    if (!res.data) return [];
    return res.data as User[];
  } catch {
    return [];
  }
}

export async function getUsersPages() {
  try {
    const res = await apiWithAuth.get('/users/pages');
    if (!res.data) return null;
    return res.data;
  } catch {
    return null;
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

export async function deleteUser(userId: string) {
  try {
    const res = await apiWithAuth.delete(`/users/${userId}`);
    if (!res.data) return null;
    return res.data as User;
  } catch {
    return null;
  }
}
