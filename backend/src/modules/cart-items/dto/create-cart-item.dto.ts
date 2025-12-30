import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  cartId: string;

  @IsUUID()
  productId: string;

  @IsOptional()
  @IsBoolean()
  isOrdered: boolean = false;

  @IsNumber()
  @Min(1)
  quantity: number;
}
