import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';

import { env } from '../../../common/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: env.githubClientId,
      clientSecret: env.githubClientSecret,
      callbackURL: env.githubCallbackUrl,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { emails, username, photos, provider } = profile;

    const user = await this.authService.validateGithubUser(
      emails[0].value,
      username,
      photos[0].value,
      provider,
    );

    return user;
  }
}
