import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { env } from '../../../common/config';
import { AccountStatus } from '../../../common/enums';
import { JwtPayload, RequestUser } from '../../../common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.status === AccountStatus.BLOCKED) {
      throw new UnauthorizedException('Account is blocked');
    }

    const user: RequestUser = {
      id: payload.sub,
      fullName: payload.fullName,
      role: payload.role,
      status: payload.status,
      type: payload.type,
    };

    return user;
  }
}
