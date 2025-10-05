'use client';

import axios, { InternalAxiosRequestConfig } from 'axios';
import { api } from './axios-instance';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { env } from '@/common/config';
import {
  getAccessToken,
  getAccessTokenFromRefreshToken,
  setAccessToken,
} from '@/common/lib/local-storage-actions';
import { isJwtExpired } from '@/common/lib/jwt';

NProgress.configure({ showSpinner: false });

api.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

const apiWithAuth = axios.create({
  baseURL: env.API_URL || '',
});

apiWithAuth.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = getAccessToken();

    if (!token || isJwtExpired(token)) {
      token = await getAccessTokenFromRefreshToken();
      if (token) setAccessToken(token);
    }

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as any;
    return config;
  },
  (error) => Promise.reject(error),
);

export { api, apiWithAuth };
