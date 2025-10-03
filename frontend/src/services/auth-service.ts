import { api, apiWithRefreshToken } from '@/services';
import {
  getAccessToken,
  setAccessToken,
} from '@/common/lib/local-storage-actions';
import { CurrentUser } from '@/common/interfaces';
import { isJwtExpired } from '@/common/lib/jwt';

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = getAccessToken();
  if (!token || isJwtExpired(token))
    return await getCurrentUserByRefreshToken(); // Get new token if token was not found or expired

  try {
    const res = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data as CurrentUser;
  } catch {
    return await getCurrentUserByRefreshToken(); // Get new token if token was expired
  }
}

export async function getCurrentUserByRefreshToken(): Promise<CurrentUser | null> {
  try {
    const res = await apiWithRefreshToken.get('/auth/refresh');
    if (res.data.isInvalid) return null;

    setAccessToken(res.data.accessToken);
    return await getCurrentUser();
  } catch {
    return null;
  }
}
