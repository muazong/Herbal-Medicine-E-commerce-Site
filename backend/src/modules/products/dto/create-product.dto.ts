import { IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
