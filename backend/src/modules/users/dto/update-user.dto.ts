import { OmitType, PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(User, ['id', 'createdAt', 'role', 'status'] as const),
) {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  address?: string;
}
