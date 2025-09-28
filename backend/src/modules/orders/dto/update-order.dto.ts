import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { OrderStatus, PaymentMethods } from '../../../common/enums';

export class UpdateOrderDto {
  @IsString()
  @Length(1, 255)
  shippingAddress?: string;

  @IsEnum(PaymentMethods)
  @IsOptional()
  paymentMethod?: PaymentMethods;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
