import {
  Length,
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @Length(1, 50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  address?: string;
}
