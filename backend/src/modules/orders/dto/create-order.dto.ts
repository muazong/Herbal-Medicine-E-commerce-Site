import { PaymentMethods } from '../../../common/enums';
import { IsEnum, IsString, Length, Matches } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @Length(1, 100)
  userName: string;

  @Matches(/^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/, {
    message: 'Phone number is invalid',
  })
  phoneNumber: string;

  @IsEnum(PaymentMethods, { message: 'Payment method is invalid' })
  paymentMethod: PaymentMethods;

  @IsString()
  @Length(1, 255)
  shippingAddress?: string;
}
