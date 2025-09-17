import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const env = {
  jwtSecret: configService.getOrThrow('JWT_SECRET') as string,
  environment: configService.getOrThrow('ENVIRONMENT') as string,
  sameSite: configService.getOrThrow<'lax' | 'strict' | 'none'>(
    'SAME_SITE_MODE',
  ),
  refreshTokenName: configService.getOrThrow('REFRESH_TOKEN_KEY') as string,
  issue: configService.getOrThrow('ISSUER') as string,
  audience: configService.getOrThrow('AUDIENCE') as string,
  refreshExpiration: configService.getOrThrow('REFRESH_EXPIRATION') as string,
  accessExpiration: configService.getOrThrow('ACCESS_EXPIRATION') as string,
  cookieExpiration: configService.getOrThrow('COOKIE_EXPIRATION'),

  // Google
  googleClientId: configService.getOrThrow('GOOGLE_CLIENT_ID') as string,
  googleClientSecret: configService.getOrThrow(
    'GOOGLE_CLIENT_SECRET',
  ) as string,
  googleCallbackUrl: configService.getOrThrow('GOOGLE_CALLBACK_URL') as string,

  // Github
  githubClientId: configService.getOrThrow('GITHUB_CLIENT_ID') as string,
  githubClientSecret: configService.getOrThrow(
    'GITHUB_CLIENT_SECRET',
  ) as string,
  githubCallbackUrl: configService.getOrThrow('GITHUB_CALLBACK_URL') as string,
};
