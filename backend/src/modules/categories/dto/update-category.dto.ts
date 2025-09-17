import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
