import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { RequestUser } from '../interfaces';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user as RequestUser;
    if (!user) throw new BadRequestException('User not found in request');

    return user;
  },
);
