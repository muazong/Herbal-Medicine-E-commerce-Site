import axios from 'axios';
import { env } from '@/common/config';

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

export { api, apiWithRefreshToken };
