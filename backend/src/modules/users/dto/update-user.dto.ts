import { Length, IsString, MinLength, IsOptional } from 'class-validator';

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
