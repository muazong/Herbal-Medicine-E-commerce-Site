'use client';

import { api } from './axios-instance';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

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

export { api };
