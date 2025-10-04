import {
  Max,
  Min,
  Length,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  sold?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}
