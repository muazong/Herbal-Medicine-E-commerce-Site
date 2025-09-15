import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const env = {
  jwtSecret: configService.getOrThrow('JWT_SECRET') as string,
  environment: configService.getOrThrow('ENVIRONMENT') as string,
  refreshTokenName: configService.getOrThrow('REFRESH_TOKEN_KEY') as string,

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
