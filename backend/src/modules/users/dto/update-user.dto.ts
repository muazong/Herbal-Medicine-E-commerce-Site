import {
  Length,
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';

import { AccountStatus } from '../../../common/enums';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(2, 50)
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  lastName?: string;

  @IsOptional()
  @Matches(/^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/, {
    message: 'Phone number is invalid',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  address?: string;

  @IsOptional()
  status?: AccountStatus;
}
