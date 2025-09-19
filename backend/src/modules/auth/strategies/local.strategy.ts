import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { AccountStatus, UserProvider } from '../../../common/enums';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (!user || user.provider !== UserProvider.LOCAL) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === AccountStatus.BLOCKED) {
      throw new UnauthorizedException('Account is blocked');
    }

    return user;
  }
}
