import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { OrderStatus, PaymentMethods } from '../../../common/enums';

export class UpdateOrderDto {
  @Matches(/^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/, {
    message: 'Phone number is invalid',
  })
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  shippingAddress?: string;

  @IsEnum(PaymentMethods)
  @IsOptional()
  paymentMethod?: PaymentMethods;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
