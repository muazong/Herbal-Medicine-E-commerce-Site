import { IsNumber, IsString, Length } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @Length(1, 255)
  shippingAddress?: string;
}
