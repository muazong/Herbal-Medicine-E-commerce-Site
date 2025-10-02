import { AxiosError } from 'axios';

import { api } from '@/common/config';
import { getAccessToken } from '@/common/lib/local-storage-actions';
import { CurrentUser } from '@/common/interfaces';

export async function getCurrentUser() {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  try {
    const res = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as CurrentUser;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response?.status === 401) {
      return null;
    }
    throw error;
  }
}
