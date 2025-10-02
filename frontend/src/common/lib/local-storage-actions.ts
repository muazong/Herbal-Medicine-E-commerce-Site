import { env } from '../config';

function setAccessToken(value: string) {
  localStorage.setItem(env.ACCESS_TOKEN, value);
}

function getAccessToken() {
  return localStorage.getItem(env.ACCESS_TOKEN);
}

export { setAccessToken, getAccessToken };
