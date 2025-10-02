import {
  Length,
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @Length(1, 50)
  lastName: string;

  @Matches(/^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/, {
    message: 'Phone number is invalid',
  })
  phone: string;

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
