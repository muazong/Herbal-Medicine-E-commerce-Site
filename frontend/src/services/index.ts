import { getCurrentUser } from './auth-service';
import { getCurrentUserByRefreshToken } from './auth-service';
import { api, apiWithRefreshToken } from './axios-instance';

export {
  api,
  apiWithRefreshToken,
  getCurrentUser,
  getCurrentUserByRefreshToken,
};
