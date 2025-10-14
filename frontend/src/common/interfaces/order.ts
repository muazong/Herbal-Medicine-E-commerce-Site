import { OrderItem } from './order-item';
import { PAYMENT_METHOD, ORDER_STATUS } from '../enums';
import { AbstractInterface } from './abstract-interface';

export interface Order extends AbstractInterface {
  userId: string;
  userName: string;
  phoneNumber: string;
  shippingAddress: string;
  paymentMethod: PAYMENT_METHOD;
  status: ORDER_STATUS;
  orderItems: OrderItem[];
  totalPrice: number;
}
