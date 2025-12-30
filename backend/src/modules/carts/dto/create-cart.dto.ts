import { IsBoolean, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateCartDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsBoolean()
  isOrdered: boolean = false;

  @IsInt()
  @Min(1)
  quantity: number;
}
