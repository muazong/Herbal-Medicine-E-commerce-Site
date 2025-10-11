import {
  getAccessToken,
  setAccessToken,
} from '@/common/lib/local-storage-actions';
import { User } from '@/common/interfaces';
import { isJwtExpired } from '@/common/lib/jwt';
import { apiWithRefreshToken } from '@/services';
import { api } from '@/services/axios-instance-client';

export async function getCurrentUser(): Promise<User | null> {
  const token = getAccessToken();
  if (!token || isJwtExpired(token))
    return await getCurrentUserByRefreshToken(); // Get new token if token was not found or expired

  try {
    const res = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data as User;
  } catch {
    return await getCurrentUserByRefreshToken(); // Get new token if token was expired
  }
}

export async function getCurrentUserByRefreshToken(): Promise<User | null> {
  try {
    const res = await apiWithRefreshToken.get('/auth/refresh');
    if (res.data.isInvalid) return null;

    setAccessToken(res.data.accessToken);
    return await getCurrentUser();
  } catch {
    return null;
  }
}
