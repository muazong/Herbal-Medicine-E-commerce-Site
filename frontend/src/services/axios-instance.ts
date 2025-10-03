import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { env } from '@/common/config';

NProgress.configure({ showSpinner: false });

const api = axios.create({
  baseURL: env.API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiWithRefreshToken = axios.create({
  baseURL: env.API_URL || '',
  withCredentials: true,
});

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

export { api, apiWithRefreshToken };
