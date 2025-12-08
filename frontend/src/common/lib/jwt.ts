import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  exp: number;
  [key: string]: unknown;
};

function isJwtExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return true;

    const now = Date.now() / 1000;
    return exp < now;
  } catch {
    return true;
  }
}

export { isJwtExpired };
