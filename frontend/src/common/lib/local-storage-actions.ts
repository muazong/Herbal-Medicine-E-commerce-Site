'use client';

import { apiWithRefreshToken } from '@/services';
import { env } from '../config';

function setAccessToken(value: string) {
  localStorage.setItem(env.ACCESS_TOKEN, value);
}

function getAccessToken() {
  return localStorage.getItem(env.ACCESS_TOKEN);
}

function removeAccessToken() {
  localStorage.removeItem(env.ACCESS_TOKEN);
}

async function getAccessTokenFromRefreshToken() {
  const res = await apiWithRefreshToken.get('/auth/refresh');
  if (res.data.isInvalid) return null;

  setAccessToken(res.data.accessToken);
  return res.data.accessToken;
}

export {
  setAccessToken,
  getAccessToken,
  removeAccessToken,
  getAccessTokenFromRefreshToken,
};
