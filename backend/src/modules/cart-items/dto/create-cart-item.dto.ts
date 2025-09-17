import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
