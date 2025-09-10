import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { UserProvider } from '../../../common/enums';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password' });
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);

    if (!user || user.provider !== UserProvider.LOCAL) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
