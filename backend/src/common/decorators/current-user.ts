import {
  ExecutionContext,
  BadRequestException,
  createParamDecorator,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { RequestUser } from '../interfaces';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user as RequestUser;
    if (!user) throw new BadRequestException('User not found in request');

    if (!isUUID(user.id)) {
      throw new BadRequestException('Invalid user id');
    }

    return user;
  },
);
