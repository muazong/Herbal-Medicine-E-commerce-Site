'use client';

import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { api } from './axios-instance';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { env } from '@/common/config';
import {
  getAccessToken,
  getAccessTokenFromFreshToken,
} from '@/common/lib/local-storage-actions';

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
    const token = await getAccessTokenFromFreshToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as any;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export { api, apiWithAuth };
