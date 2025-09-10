import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, emails, username, photos } = profile;

    const user = await this.authService.validateGithubUser(
      id,
      emails[0].value,
      username,
      photos[0].value,
    );

    return user;
  }
}
